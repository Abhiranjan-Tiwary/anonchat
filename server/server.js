import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import fsSync from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import http from "node:http";
import jwt from "jsonwebtoken";
import multer from "multer";
import nodemailer from "nodemailer";
import helmet from "helmet";
import { v2 as cloudinary } from "cloudinary";
import { Server } from "socket.io";
import { fileURLToPath } from "node:url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);
globalThis.anonchatIo = io;

const PORT = Number(process.env.PORT || 3000);
const SERVER_DIR = __dirname;
const ROOT_DIR = path.resolve(SERVER_DIR, "..");
const CLIENT_DIR = path.join(ROOT_DIR, "client");
const DATABASE_NAME = process.env.MONGODB_DB || "anonchat";
const SESSION_DAYS = 7;
const EDIT_WINDOW_MS = 5 * 60 * 1000;
const RESET_OTP_MINUTES = clampOtpExpireMinutes(process.env.OTP_EXPIRE_MINUTES);
const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "audio/webm",
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/ogg",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);
const PUBLIC_EMAIL_DOMAINS = new Set(["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"]);
const configuredOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.CLIENT_URL,
  ...configuredOrigins,
].filter(Boolean);

const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || "siteadmin").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@12345";
const ADMIN_NAME = process.env.ADMIN_NAME || "Site Admin";
const AUTH_COOKIE = "anonchat_token";
const JWT_SECRET = process.env.JWT_SECRET || "";
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be 32+ characters in .env");
}
const EMAIL_FROM = process.env.EMAIL_FROM || `"AnonChat" <${process.env.EMAIL_USER || "supportanonchat@gmail.com"}>`;
const transporter =
  process.env.EMAIL_USER && process.env.EMAIL_PASS
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
    : null;
const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);
if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}
const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_ATTACHMENT_BYTES },
});
const DEFAULT_PLATFORM_SETTINGS = {
  maintenanceMode: false,
  registrationOpen: true,
  maxRoomSize: 250,
  maxMessageLength: 280,
  rateLimitPerMinute: 20,
  profanityFilter: true,
  guestModeAllowed: true,
  autoDeleteMessages: true,
  emailNotifications: false,
};
const AUDIT_TARGET_TYPES = new Set(["user", "message", "room", "report", "announcement", "settings"]);
const FRIEND_REQUEST_STATUSES = Object.freeze(["pending", "accepted", "declined", "cancelled"]);
const FRIENDSHIP_STATUSES = Object.freeze(["active", "removed"]);
const DM_THREAD_STATUSES = Object.freeze(["active", "archived", "deleted"]);

const MONGODB_URI = process.env.MONGODB_URI || "";
const hasMongoPlaceholder = /<[^>]+>/.test(MONGODB_URI);
let db;
let models = {};
let databaseLabel = "MongoDB Atlas";

const typingUsers = new Map();
const verifiedRoomsByUser = new Map();
const tokenCache = new Map();
const adminTokenCache = new Map();
const callSessions = new Map();
const activeCallsByUser = new Map();
let _roomsCache = null;
let _roomsCacheTime = 0;

const anonymousNames = [
  "Silent Nova",
  "Campus Ghost",
  "Blue Pixel",
  "Hidden Orbit",
  "Quiet Spark",
  "Midnight Byte",
  "Echo Student",
  "Velvet Signal",
  "Silver Comet",
  "Orbit Note",
];

const avatarColors = ["#22d3ee", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#14b8a6"];
const bannedWords = ["abuse", "hate", "leak", "dox", "password"];

const PASSWORD_RULE_MESSAGE =
  "Password must be 8-64 characters and include uppercase, lowercase, number, and symbol (! @ # $ % ^ & * _ - + = . ?).";

const loginFailureCounters = new Map();
const relaxedAuthLimits = process.env.NODE_ENV !== "production";
const rateLimiters = {
  auth: createRateLimiter({
    windowMs: (req) => (relaxedAuthLimits || isLocalRequest(req) ? 5 * 60 * 1000 : 10 * 60 * 1000),
    max: (req) => (relaxedAuthLimits || isLocalRequest(req) ? 200 : 60),
  }),
  message: createRateLimiter({ windowMs: 60 * 1000, max: 20 }),
  report: createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 }),
  reset: createRateLimiter({ windowMs: 15 * 60 * 1000, max: 3 }),
};

app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));
app.use(securityHeaders);
app.use(corsGuard);
app.use(express.json({ limit: "6mb" }));
app.use("/css", express.static(path.join(CLIENT_DIR, "css")));
app.use("/js", express.static(path.join(CLIENT_DIR, "js")));
app.use("/assets", express.static(path.join(CLIENT_DIR, "assets")));
app.use(express.static(CLIENT_DIR, { index: false }));

function securityHeaders(req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(self), geolocation=(), microphone=(self)");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "connect-src 'self' ws: wss: https://res.cloudinary.com https://api.cloudinary.com https://*.cloudinary.com https://fonts.googleapis.com https://fonts.gstatic.com",
      "media-src 'self' blob: data: https://res.cloudinary.com https://*.cloudinary.com",
      "manifest-src 'self'",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ")
  );
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
  next();
}

function corsGuard(req, res, next) {
  const origin = req.headers.origin;
  const isDev = process.env.NODE_ENV !== "production";
  const allowed = !origin || allowedOrigins.includes(origin) || isDev;

  if (origin && allowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (origin && !allowed) {
    res.status(403).json({ error: "Origin not allowed." });
    return;
  }

  next();
}

function sendFrontend(res) {
  const staticIndex = path.join(CLIENT_DIR, "index.html");
  res.sendFile(staticIndex);
}

function requestToken(req) {
  const bodyToken = String(req.body?.token || "").trim();
  if (bodyToken) return bodyToken;

  const queryToken = String(req.query?.token || "").trim();
  if (queryToken) return queryToken;

  const authHeader = req.headers.authorization || "";
  if (authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  return parseCookies(req.headers.cookie || "")[AUTH_COOKIE] || "";
}

function parseCookies(cookieHeader) {
  return String(cookieHeader || "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const index = part.indexOf("=");
      if (index === -1) return cookies;
      const key = decodeURIComponent(part.slice(0, index));
      cookies[key] = decodeURIComponent(part.slice(index + 1));
      return cookies;
    }, {});
}

function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

function createRateLimiter({ windowMs, max }) {
  const hits = new Map();

  return (req, res, next) => {
    const limitWindowMs = typeof windowMs === "function" ? windowMs(req) : windowMs;
    const limitMax = typeof max === "function" ? max(req) : max;
    const key = `${clientIp(req)}:${req.path}`;
    const now = Date.now();
    const record = hits.get(key) || { count: 0, resetAt: now + limitWindowMs };

    if (record.resetAt <= now) {
      record.count = 0;
      record.resetAt = now + limitWindowMs;
    }

    record.count += 1;
    hits.set(key, record);

    if (record.count > limitMax) {
      res.status(429).json({ error: "Too many requests. Please wait and try again." });
      return;
    }

    next();
  };
}

function loginRateLimit(req, res, next) {
  cleanupLoginFailureCounters();

  const key = loginFailureKey(req);
  const record = loginFailureCounters.get(key);
  const now = Date.now();

  if (record?.lockedUntil && record.lockedUntil > now) {
    const retryAfterSeconds = Math.max(1, Math.ceil((record.lockedUntil - now) / 1000));
    res.setHeader("Retry-After", String(retryAfterSeconds));
    res.status(429).json({
      error: `Too many failed login attempts. Please try again in ${retryAfterSeconds} seconds.`,
      retryAfterSeconds,
    });
    return;
  }

  next();
}

function recordLoginFailure(req) {
  cleanupLoginFailureCounters();

  const key = loginFailureKey(req);
  const now = Date.now();
  const config = loginRateLimitConfig(req);
  const current = loginFailureCounters.get(key) || {
    count: 0,
    resetAt: now + config.windowMs,
    lockedUntil: 0,
  };

  if (current.resetAt <= now) {
    current.count = 0;
    current.resetAt = now + config.windowMs;
    current.lockedUntil = 0;
  }

  current.count += 1;

  if (current.count >= config.maxFailedAttempts) {
    current.lockedUntil = now + config.lockoutMs;
  }

  loginFailureCounters.set(key, current);

  return {
    limited: Boolean(current.lockedUntil && current.lockedUntil > now),
    retryAfterSeconds: current.lockedUntil
      ? Math.max(1, Math.ceil((current.lockedUntil - now) / 1000))
      : 0,
  };
}

function resetLoginFailures(req) {
  loginFailureCounters.delete(loginFailureKey(req));
}

function loginFailureKey(req) {
  return `${clientIp(req)}:${loginIdentifier(req)}`;
}

function loginIdentifier(req) {
  return String(req.body?.identifier || req.body?.username || req.body?.email || "")
    .trim()
    .toLowerCase()
    .slice(0, 120) || "unknown";
}

function loginRateLimitConfig(req) {
  const relaxed = process.env.NODE_ENV !== "production" || isLocalRequest(req);

  return {
    maxFailedAttempts: relaxed ? 50 : 8,
    windowMs: relaxed ? 5 * 60 * 1000 : 10 * 60 * 1000,
    lockoutMs: relaxed ? 15 * 1000 : 2 * 60 * 1000,
  };
}

function cleanupLoginFailureCounters() {
  const now = Date.now();
  for (const [key, record] of loginFailureCounters.entries()) {
    const lockActive = record.lockedUntil && record.lockedUntil > now;
    if (!lockActive && record.resetAt <= now) {
      loginFailureCounters.delete(key);
    }
  }
}

function clientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const ip = forwarded || req.ip || req.socket.remoteAddress || "local";
  return String(ip).replace(/^::ffff:/, "");
}

function isLocalRequest(req) {
  const ip = clientIp(req);
  const host = String(req.headers.host || "").toLowerCase();

  return (
    ip === "local" ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "0:0:0:0:0:0:0:1" ||
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]")
  );
}

function devLog(...args) {
  if (process.env.NODE_ENV !== "production") {
    console.info(...args);
  }
}

function runBackgroundTask(task, label) {
  Promise.resolve()
    .then(task)
    .catch((error) => {
      console.error(`${label} failed:`, error);
    });
}

function clearTokenCacheForUser(userId) {
  const id = String(userId || "");
  if (!id) return;

  for (const [token, cached] of tokenCache.entries()) {
    if (String(cached.user?.id || "") === id) tokenCache.delete(token);
  }
}

function invalidateRoomsCache() {
  _roomsCache = null;
  _roomsCacheTime = 0;
}

async function getCachedRooms() {
  if (_roomsCache && Date.now() - _roomsCacheTime < 30000) {
    return _roomsCache;
  }

  const rooms = await models.Room.find({ status: "active" }).lean({ virtuals: false });
  _roomsCache = normalizeDocument(rooms);
  _roomsCacheTime = Date.now();
  return _roomsCache;
}

async function recentVisibleMessages(filter = {}, limit = 25) {
  const messages = await db.collection("messages")
    .find({
      ...filter,
      hidden: { $ne: true },
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return messages.sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
}

async function connectDB() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is missing. AnonChat requires MongoDB persistence.");
    process.exit(1);
  }

  if (hasMongoPlaceholder) {
    console.error("MONGODB_URI still contains a placeholder value. Replace it with a real MongoDB connection string.");
    process.exit(1);
  }

  try {
    models = await loadMongooseModels();
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: DATABASE_NAME,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      autoIndex: false,
    });

    db = createMongooseDb(models);
    databaseLabel = `MongoDB ${conn.connection.name || DATABASE_NAME}`;
    devLog("✓ MongoDB connected");
    await prepareDatabase();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    if (/whitelist|could not connect to any servers|server selection/i.test(error.message || "")) {
      console.error("Atlas blocked this machine from connecting.");
      console.error("Fix: MongoDB Atlas > Network Access > Add IP Address > Add Current IP Address.");
      console.error("For local testing only, you can temporarily allow 0.0.0.0/0, then remove it before hosting.");
    }
    error.startupLogged = true;
    throw error;
  }
}

async function loadMongooseModels() {
  const module = await import("./models/index.js");
  return module.default;
}

async function prepareDatabase() {
  await prepareRoomCollection();
  await removeLegacyIndexes();
  await initializeMongoModels();
  await ensureProductionIndexes();
  await backfillRoomPasswordFlags();
  await seedDefaultRooms();
}

async function initializeMongoModels() {
  const uniqueModels = [...new Set(Object.values(models))];
  await Promise.all(uniqueModels.map((model) => model.createCollection().catch(ignoreExistingCollection)));
  await Promise.all(uniqueModels.map((model) => model.createIndexes()));
}

async function ensureProductionIndexes() {
  await Promise.all([
    db.collection("messages").createIndex({ roomId: 1, createdAt: -1 }),
    db.collection("messages").createIndex({ authorId: 1, createdAt: -1 }),
    db.collection("messages").createIndex({ clientTempId: 1 }, { sparse: true, name: "clientTempId_sparse_idx" }),
    db.collection("calls").createIndex({ createdAt: -1 }),
    db.collection("calls").createIndex({ callerId: 1, targetId: 1, startedAt: -1 }),
    db.collection("reports").createIndex({ status: 1, createdAt: -1 }),
    db.collection("rooms").createIndex({ status: 1, hidden: 1 }),
    db.collection("friendRequests").createIndex({ id: 1 }, { unique: true, sparse: true }),
    db.collection("friendRequests").createIndex({ pairKey: 1, status: 1, createdAt: -1 }),
    db.collection("friendRequests").createIndex({ fromUserId: 1, toUserId: 1, status: 1 }),
    db.collection("friendRequests").createIndex({ toUserId: 1, status: 1, createdAt: -1 }),
    db.collection("friendRequests").createIndex({ fromUserId: 1, status: 1, createdAt: -1 }),
    db.collection("friendships").createIndex({ id: 1 }, { unique: true, sparse: true }),
    db.collection("friendships").createIndex({ pairKey: 1 }, { unique: true }),
    db.collection("friendships").createIndex({ userIds: 1, status: 1, updatedAt: -1 }),
    db.collection("dmThreads").createIndex({ id: 1 }, { unique: true, sparse: true }),
    db.collection("dmThreads").createIndex({ pairKey: 1 }, { unique: true }),
    db.collection("dmThreads").createIndex({ participantIds: 1, status: 1, updatedAt: -1 }),
    db.collection("dmThreads").createIndex({ status: 1, lastMessageAt: -1 }),
    db.collection("dmMessages").createIndex({ id: 1 }, { unique: true, sparse: true }),
    db.collection("dmMessages").createIndex({ threadId: 1, createdAt: -1 }),
    db.collection("dmMessages").createIndex({ senderId: 1, createdAt: -1 }),
    db.collection("dmMessages").createIndex({ recipientId: 1, createdAt: -1 }),
    db.collection("dmMessages").createIndex({ participantIds: 1, createdAt: -1 }),
    db.collection("dmMessages").createIndex({ clientTempId: 1 }, { sparse: true, name: "dmClientTempId_sparse_idx" }),
  ]);
}

function ignoreExistingCollection(error) {
  if (error?.code === 48 || error?.codeName === "NamespaceExists") return null;
  throw error;
}

async function prepareRoomCollection() {
  const { backfillRoomSlugs } = await import("./config/seeder.js");
  await backfillRoomSlugs();
}

async function removeLegacyIndexes() {
  const { dropLegacyIndexes } = await import("./config/seeder.js");
  await dropLegacyIndexes();
}

async function seedDefaultRooms() {
  const { seedRooms } = await import("./config/seeder.js");
  await seedRooms();
  invalidateRoomsCache();
}

async function backfillRoomPasswordFlags() {
  await models.Room.updateMany(
    {
      $or: [
        { isPasswordProtected: true },
        { passwordProtected: true },
        { password: { $exists: true, $nin: [null, ""] } },
        { passwordHash: { $exists: true, $nin: [null, ""] } },
      ],
    },
    {
      $set: {
        isPasswordProtected: true,
        passwordProtected: true,
      },
    }
  );
}

function createMongooseDb(modelMap) {
  const collectionModels = {
    users: modelMap.User,
    sessions: modelMap.Session,
    adminSessions: modelMap.AdminSession,
    rooms: modelMap.Room,
    messages: modelMap.Message,
    reports: modelMap.Report,
    deletedUsers: modelMap.DeletedUser,
    passwordResets: modelMap.PasswordReset,
    adminAuditLogs: modelMap.AuditLog || modelMap.AdminAuditLog,
    announcements: modelMap.Announcement,
    platformSettings: modelMap.PlatformSettings,
    calls: modelMap.Call,
    friendRequests: modelMap.FriendRequest,
    friendships: modelMap.Friendship,
    dmThreads: modelMap.DmThread,
    dmMessages: modelMap.DmMessage,
  };

  return {
    collection(name) {
      const model = collectionModels[name];
      if (!model) throw new Error(`Unknown MongoDB collection: ${name}`);
      return new MongooseCollection(model);
    },
  };
}

class MongooseCollection {
  constructor(model) {
    this.model = model;
  }

  async createIndex(keys, options = {}) {
    return this.model.collection.createIndex(keys, options);
  }

  async insertOne(doc) {
    const created = await this.model.create(doc);
    return { acknowledged: true, insertedId: created._id || created.id };
  }

  async insertMany(docs) {
    const created = await this.model.insertMany(docs, { ordered: true });
    return { acknowledged: true, insertedCount: created.length };
  }

  async findOne(filter = {}, options = {}) {
    let query = this.model.findOne(filter);
    query = applyMongooseProjection(query, options.projection);
    return normalizeDocument(await query.lean({ virtuals: false }));
  }

  find(filter = {}, options = {}) {
    let query = this.model.find(filter);
    query = applyMongooseProjection(query, options.projection);
    return new MongooseCursor(query);
  }

  async countDocuments(filter = {}) {
    return this.model.countDocuments(filter);
  }

  async updateOne(filter, update, options = {}) {
    const result = await this.model.updateOne(filter, update, options);
    return normalizeMongoResult(result);
  }

  async updateMany(filter, update) {
    const result = await this.model.updateMany(filter, update);
    return normalizeMongoResult(result);
  }

  async deleteOne(filter) {
    const result = await this.model.deleteOne(filter);
    return normalizeMongoResult(result);
  }

  async deleteMany(filter = {}) {
    const result = await this.model.deleteMany(filter);
    return normalizeMongoResult(result);
  }
}

class MongooseCursor {
  constructor(query) {
    this.query = query;
  }

  sort(spec = {}) {
    this.query = this.query.sort(spec);
    return this;
  }

  limit(count) {
    this.query = this.query.limit(Number(count));
    return this;
  }

  async toArray() {
    return normalizeDocument(await this.query.lean({ virtuals: false }));
  }
}

function applyMongooseProjection(query, projection) {
  return projection && Object.keys(projection).length > 0 ? query.select(projection) : query;
}

function normalizeMongoResult(result) {
  return {
    acknowledged: result.acknowledged !== false,
    matchedCount: result.matchedCount || 0,
    modifiedCount: result.modifiedCount || 0,
    deletedCount: result.deletedCount || 0,
    upsertedCount: result.upsertedCount || 0,
    upsertedId: result.upsertedId,
  };
}

function normalizeDocument(value) {
  if (value == null) return value;
  if (value instanceof Date) return value.getTime();
  if (Array.isArray(value)) return value.map(normalizeDocument);

  if (typeof value === "object") {
    if (typeof value.toHexString === "function") return value.toHexString();

    return Object.entries(value).reduce((next, [key, item]) => {
      next[key] = normalizeDocument(item);
      return next;
    }, {});
  }

  return value;
}

app.get("/", (req, res) => {
  sendFrontend(res);
});

app.get(
  [
    "/login",
    "/register",
    "/signup",
    "/privacy",
    "/data-deletion",
    "/admin",
    "/chat",
    "/dashboard",
    "/friends",
    "/my-rooms",
    "/settings",
    "/profile",
    "/notifications",
    "/dashboard/my-rooms",
    "/dashboard/friends",
    "/dashboard/settings",
    "/dashboard/profile",
    "/dashboard/notifications",
    "/admin/dashboard",
    "/admin/users",
    "/admin/chat-rooms",
    "/admin/reports",
    "/admin/blocked-users",
    "/admin/messages-monitoring",
    "/admin/announcements",
    "/admin/settings",
  ],
  (req, res) => {
    sendFrontend(res);
  }
);

app.get("/dashboard/rooms/:roomId", (req, res) => {
  sendFrontend(res);
});

app.get(["/dm/:threadId", "/dashboard/dm/:threadId"], (req, res) => {
  sendFrontend(res);
});

app.get("/test", async (req, res) => {
  res.json({
    ok: true,
    database: "MongoDB Atlas",
    collections: [
      "users",
      "sessions",
      "adminSessions",
      "rooms",
      "messages",
      "reports",
      "deletedUsers",
      "announcements",
      "platformSettings",
    ],
  });
});

app.get("/api/state", async (req, res) => {
  let user = null;
  const token = requestToken(req);
  if (token) {
    try {
      user = await requireUser(token);
    } catch (error) {
      user = null;
    }
  }
  res.json(await createPublicState(user));
});

app.post("/api/auth/register", rateLimiters.auth, async (req, res) => {
  try {
    const userData = await registerUser(req.body);
    setAuthCookie(res, userData.token);
    res.status(201).json(userData);
    runBackgroundTask(broadcastState, "Auth state broadcast");
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/auth/login", loginRateLimit, async (req, res) => {
  try {
    const userData = await loginUser(req.body);
    resetLoginFailures(req);
    setAuthCookie(res, userData.token);
    res.json(userData);
    runBackgroundTask(broadcastState, "Auth state broadcast");
  } catch (error) {
    if (!error.status || error.status >= 500) {
      console.error("Login error:", error);
    }
    if (error.status === 401 || error.status === 404) {
      const failure = recordLoginFailure(req);
      if (failure.limited) {
        res.setHeader("Retry-After", String(failure.retryAfterSeconds));
        res.status(429).json({
          error: `Too many failed login attempts. Please try again in ${failure.retryAfterSeconds} seconds.`,
          retryAfterSeconds: failure.retryAfterSeconds,
        });
        return;
      }
    }
    if (error.status && error.status < 500) {
      handleError(res, error);
      return;
    }
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

app.post("/api/auth/admin-login", loginRateLimit, async (req, res) => {
  try {
    const userData = await loginAdmin(req.body);
    resetLoginFailures(req);
    setAuthCookie(res, userData.token);
    res.json(userData);
    runBackgroundTask(broadcastState, "Auth state broadcast");
  } catch (error) {
    if (error.status === 401 || error.status === 404) {
      const failure = recordLoginFailure(req);
      if (failure.limited) {
        res.setHeader("Retry-After", String(failure.retryAfterSeconds));
        res.status(429).json({
          error: `Too many failed login attempts. Please try again in ${failure.retryAfterSeconds} seconds.`,
          retryAfterSeconds: failure.retryAfterSeconds,
        });
        return;
      }
    }
    handleError(res, error);
  }
});

app.post("/api/auth/logout", async (req, res) => {
  try {
    const rawToken = requestToken(req);
    const tokenHash = hashToken(rawToken);

    await db.collection("sessions").deleteOne({ tokenHash });
    await db.collection("adminSessions").deleteOne({ tokenHash });
    tokenCache.delete(rawToken);
    adminTokenCache.delete(rawToken);

    clearAuthCookie(res);
    await broadcastState();
    res.json({ ok: true });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/auth/social/:provider/start", rateLimiters.auth, (req, res) => {
  try {
    const provider = normalizeSocialProvider(req.params.provider);
    const config = socialProviderConfig(provider, req);

    if (!config.configured) {
      sendSocialAuthPopupResult(res, {
        ok: false,
        error: `${capitalize(provider)} login needs ${config.requiredEnv.join(" and ")} in .env.`,
        origin: socialClientOrigin(req),
      });
      return;
    }

    const authUrl = createSocialAuthUrl(provider, config, req.query || {}, req);
    res.redirect(authUrl);
  } catch (error) {
    sendSocialAuthPopupResult(res, {
      ok: false,
      error: error.message || "Social login could not be started.",
      origin: socialClientOrigin(req),
    });
  }
});

app.post("/api/auth/social/:provider", rateLimiters.auth, (req, res) => {
  try {
    const provider = normalizeSocialProvider(req.params.provider);
    const config = socialProviderConfig(provider, req);
    if (!config.configured) {
      throw createHttpError(501, `${capitalize(provider)} login needs ${config.requiredEnv.join(" and ")} in .env.`);
    }

    res.json({
      authUrl: createSocialAuthUrl(provider, config, req.body || {}, req),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/auth/social/:provider/callback", rateLimiters.auth, async (req, res) => {
  let statePayload = null;

  try {
    const provider = normalizeSocialProvider(req.params.provider);
    const config = socialProviderConfig(provider, req);
    const code = String(req.query.code || "").trim();
    const oauthError = String(req.query.error_description || req.query.error || "").trim();

    statePayload = verifySocialState(provider, req.query.state);

    if (oauthError) throw createHttpError(400, oauthError);
    if (!code) throw createHttpError(400, "Social login was cancelled.");
    if (!config.configured) throw createHttpError(501, `${capitalize(provider)} login is not configured.`);

    const profile = provider === "google"
      ? await fetchGoogleProfile(code, config)
      : await fetchFacebookProfile(code, config);
    const userData = await loginSocialUser(provider, profile, statePayload);

    setAuthCookie(res, userData.token);
    runBackgroundTask(broadcastState, "Social auth state broadcast");
    sendSocialAuthPopupResult(res, {
      ok: true,
      session: userData,
      origin: statePayload.origin || socialClientOrigin(req),
    });
  } catch (error) {
    sendSocialAuthPopupResult(res, {
      ok: false,
      error: error.message || "Social login failed.",
      origin: statePayload?.origin || socialClientOrigin(req),
    });
  }
});

app.post("/api/auth/forgot-password", rateLimiters.reset, async (req, res) => {
  try {
    const result = await requestPasswordReset(req.body.email);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/auth/verify-reset-otp", rateLimiters.reset, async (req, res) => {
  try {
    const result = await verifyResetOtp(req.body);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/auth/reset-password", rateLimiters.reset, async (req, res) => {
  try {
    const result = await resetPassword(req.body);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/auth/password-reset/request", rateLimiters.reset, async (req, res) => {
  try {
    const result = await requestPasswordReset(req.body.email);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/auth/password-reset/confirm", rateLimiters.reset, async (req, res) => {
  try {
    const result = await resetPassword(req.body);
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
});

app.patch("/api/users/profile", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    const updated = await updateProfile(user, req.body.profile || {});

    await broadcastState();
    res.json({ user: sanitizeUser(updated) });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/upload/avatar/base64", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const result = await uploadBase64Media({
      dataUrl: req.body.dataUrl,
      folder: "anonchat/avatars",
      allowedKinds: new Set(["image"]),
      maxBytes: 2 * 1024 * 1024,
      publicId: `avatar_${user.id}_${Date.now()}`,
    });

    res.json({
      ok: true,
      success: true,
      url: result.url || result.dataUrl,
      dataUrl: result.dataUrl || result.url,
      publicId: result.publicId || "",
      storage: result.storage,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/upload/chat", runSingleUpload("file"), async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    if (!req.file) throw createHttpError(400, "Choose a file to upload.");

    const attachment = await uploadChatFile(req.file, user);
    res.json({
      ok: true,
      success: true,
      attachment,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete("/api/upload/avatar", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const publicId = cleanText(req.body.publicId || req.body.avatarPublicId || "", 180);
    if (publicId && cloudinaryConfigured) {
      await cloudinary.uploader.destroy(publicId, { invalidate: true }).catch((error) => {
        console.warn("Cloudinary avatar delete failed:", error.message);
      });
    }

    await db.collection("users").updateOne(
      { id: user.id },
      {
        $set: {
          avatarDataUrl: "",
          avatarPublicId: "",
          lastSeen: Date.now(),
        },
      }
    );
    clearTokenCacheForUser(user.id);
    res.json({ ok: true, success: true, url: "", avatarDataUrl: "" });
  } catch (error) {
    handleError(res, error);
  }
});

app.patch("/api/users/password", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    await changeUserPassword(user, req.body);
    res.json({ ok: true });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete("/api/users/profile", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    await deleteUserAccount(user.id);
    clearAuthCookie(res);
    await broadcastState();
    res.json({ ok: true });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/users/blocked", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    const users = await listBlockedUsers(user);
    res.json({
      success: true,
      blockedUsers: users.map((blockedUser) => blockedUser.id),
      users,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/users/block", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const blocked = await blockUser(user, req.body.blockedUserId);
    await broadcastState();
    res.json({
      success: true,
      message: "User blocked",
      blockedUserId: blocked.id,
      user: blocked,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/users/unblock", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    const blocked = await unblockUser(user, req.body.blockedUserId);
    await broadcastState();
    res.json({
      success: true,
      message: "User unblocked",
      blockedUserId: blocked.id,
      user: blocked,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/users/search", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const query = cleanText(req.query.q || req.query.query || "", 60);
    const users = await searchUsersForFriendRequest(user, query);

    res.json({
      success: true,
      query,
      users,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/friends", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const friends = await listFriendsForUser(user);

    res.json({
      success: true,
      count: friends.length,
      friends,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/friends/requests", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const requests = await listFriendRequestsForUser(user);

    res.json({
      success: true,
      ...requests,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/friends/requests", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const targetUserId = req.body.targetUserId || req.body.userId || req.body.toUserId;
    const result = await createFriendRequest(user, targetUserId);

    res.status(result.created ? 201 : 200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.patch("/api/friends/requests/:requestId", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const result = await respondToFriendRequest(user, req.params.requestId, req.body.action);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete("/api/friends/requests/:requestId", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const result = await cancelFriendRequest(user, req.params.requestId);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/dms/threads", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const threads = await listDmThreadsForUser(user);

    res.json({
      success: true,
      count: threads.length,
      threads,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/dms/threads", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const targetUserId = req.body.targetUserId || req.body.userId || req.body.recipientId;
    const result = await getOrCreateDmThread(user, targetUserId);

    res.status(result.created ? 201 : 200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/dms/threads/:threadId/messages", rateLimiters.message, async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const result = await listDmMessagesForThread(user, req.params.threadId, req.query);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/dms/threads/:threadId/messages", rateLimiters.message, async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const result = await createDmMessage(user, req.params.threadId, req.body);

    res.status(result.deduped ? 200 : 201).json({
      success: true,
      ...result,
      message: serializeDmMessage(result.message),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.patch("/api/dms/threads/:threadId/seen", rateLimiters.message, async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const result = await markDmThreadSeen(req.params.threadId, user);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/rooms/mine", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    res.json({ rooms: await listUserRooms(user) });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/rooms", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    const accessSet = verifiedRoomIdsForUser(user);
    const rooms = req.query.createdBy === "me"
      ? await listUserRooms(user)
      : (await getCachedRooms()).map((room) => serializeRoom(room, user, accessSet));
    res.json({ rooms });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/rooms", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const room = await createUserRoom(req.body.room || req.body, user);
    await broadcastRooms();
    res.status(201).json({ room: serializeRoom(room, user, new Set([room.id])) });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/rooms/verify-password", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const { room, messages } = await verifyRoomPassword(req.body.roomId, user, req.body.password);
    res.json({
      success: true,
      room: serializeRoom(room, user, new Set([room.id])),
      messages: messages.map(serializeMessage),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/rooms/:roomId/join", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const { room, messages } = await joinRoomWithPassword(req.params.roomId, user, req.body.password);
    res.json({ ok: true, room: serializeRoom(room, user, new Set([room.id])), messages: messages.map(serializeMessage) });
  } catch (error) {
    handleError(res, error);
  }
});

app.patch("/api/rooms/:roomId", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    const room = await updateUserRoom(req.params.roomId, req.body.room || req.body, user);
    await broadcastRooms();
    res.json({ room: serializeRoom(room, user, new Set([room.id])) });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete("/api/rooms/:roomId", async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    await deleteUserRoom(req.params.roomId, user);
    await broadcastRooms();
    res.json({ ok: true });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/messages", rateLimiters.message, async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);

    const room = await findRealtimeRoom(req.query.roomId);
    if (!room) throw createHttpError(404, "Room not found.");
    await requireRoomEntry(room, user);

    const limit = Math.max(1, Math.min(Number.parseInt(req.query.limit || "50", 10) || 50, 100));
    const beforeTime = req.query.before ? new Date(String(req.query.before)).getTime() : 0;
    const query = {
      roomId: room.id,
      hidden: { $ne: true },
    };

    if (Number.isFinite(beforeTime) && beforeTime > 0) {
      query.createdAt = { $lt: beforeTime };
    }

    const blockedIds = await blockedAuthorIds(user);
    const messages = await db.collection("messages")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    res.json({
      roomId: room.id,
      messages: messages
        .reverse()
        .filter((message) => !blockedIds.has(String(message.authorId || "")))
        .map(serializeMessage),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/messages", rateLimiters.message, async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);

    const result = await createMessage(user, req.body);
    typingUsers.delete(user.id);

    emitTyping(user, result.message.roomId, false);
    emitMessageNew(result.message);
    res.status(201).json({ ...result, message: serializeMessage(result.message) });
    runBackgroundTask(broadcastRooms, "Message rooms broadcast");
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/typing", rateLimiters.message, async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    handleTyping(user, req.body);

    res.json({ ok: true });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/messages/:messageId/react", rateLimiters.message, async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const message = await toggleReaction(req.params.messageId, user.id, req.body.emoji);

    emitReactionUpdate(message);
    res.json({ message: serializeMessage(message) });
  } catch (error) {
    handleError(res, error);
  }
});

app.patch("/api/messages/:messageId", rateLimiters.message, async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const message = await editMessage(req.params.messageId, user, req.body.text);

    emitMessageUpdate(message);
    res.json({ message: serializeMessage(message) });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete("/api/messages/:messageId", rateLimiters.message, async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const result = await deleteMessage(req.params.messageId, user, req.body.scope);

    if (result.scope === "everyone" && result.message?.deletedAt) {
      emitMessageUpdate(result.message);
      await broadcastRooms();
    } else if (result.scope === "everyone") {
      emitMessageDelete(result.message, result.scope);
      await broadcastRooms();
    }

    res.json({ ok: true, ...result });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/polls", rateLimiters.message, async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);

    const result = await createPollMessage(user, req.body);
    emitMessageNew(result.message);
    await broadcastRooms();
    res.status(201).json({ ...result, message: serializeMessage(result.message) });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/polls/:messageId/vote", rateLimiters.message, async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const message = await votePoll(req.params.messageId, req.body.optionId, user.id);

    emitMessageUpdate(message);
    res.json({ message });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/reports", rateLimiters.report, async (req, res) => {
  try {
    const user = await requireUser(requestToken(req));
    ensureActiveUser(user);
    const report = await createReport(req.body.messageId, req.body.reason, user.id);

    await broadcastState();
    res.status(201).json({ report });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/admin/state", async (req, res) => {
  try {
    await requireAdmin(requestToken(req));
    res.json(await createAdminState());
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/admin/stats", async (req, res) => {
  try {
    await requireAdmin(requestToken(req));
    res.json({ stats: await createAdminStats() });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/admin/users", async (req, res) => {
  try {
    await requireAdmin(requestToken(req));
    const adminState = await createAdminState();
    res.json({ users: adminState.users });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/admin/rooms", async (req, res) => {
  try {
    await requireAdmin(requestToken(req));
    const rooms = await db.collection("rooms").find().sort({ createdAt: -1 }).toArray();
    res.json({ rooms: rooms.map(removeMongoId) });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/admin/messages", async (req, res) => {
  try {
    await requireAdmin(requestToken(req));
    const messages = await db.collection("messages").find().sort({ createdAt: -1 }).limit(500).toArray();
    res.json({ messages: messages.map(serializeMessage) });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/admin/message-users", async (req, res) => {
  try {
    await requireAdmin(requestToken(req));

    const users = await models.Message.aggregate([
      {
        $match: {
          hidden: { $ne: true },
          authorId: { $exists: true, $nin: ["", null] },
        },
      },
      { $sort: { createdAt: -1, _id: -1 } },
      {
        $group: {
          _id: "$authorId",
          author: { $first: "$author" },
          avatarColor: { $first: "$avatarColor" },
          avatarDataUrl: { $first: "$avatarDataUrl" },
          lastMessage: { $first: "$text" },
          lastTime: { $first: "$createdAt" },
          totalMessages: { $sum: 1 },
        },
      },
      { $sort: { lastTime: -1 } },
      { $limit: 250 },
    ]);

    res.json({ users: normalizeDocument(users) });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/admin/user-messages/:userId", async (req, res) => {
  try {
    await requireAdmin(requestToken(req));
    const filter = { authorId: req.params.userId };
    const [rawMessages, totalMessages] = await Promise.all([
      models.Message.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .limit(150)
        .lean({ virtuals: false }),
      models.Message.countDocuments(filter),
    ]);

    const seen = new Set();
    const messages = normalizeDocument(rawMessages)
      .filter((message) => {
        const id = String(message.id || message._id || "");
        if (!id || seen.has(id)) return false;
        seen.add(id);
        return true;
      })
      .slice(0, 100)
      .map((message) => {
        const id = String(message.id || message._id || "");
        return { ...removeMongoId(message), id };
      });

    res.json({ messages, totalMessages });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/admin/reports", async (req, res) => {
  try {
    await requireAdmin(requestToken(req));
    const adminState = await createAdminState();
    res.json({ reports: adminState.reports });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/admin/blocked-users", async (req, res) => {
  try {
    await requireAdmin(requestToken(req));
    const adminState = await createAdminState();
    res.json({ users: adminState.users.filter((user) => user.status === "suspended") });
  } catch (error) {
    handleError(res, error);
  }
});

app.patch("/api/admin/reports/:reportId", async (req, res) => {
  try {
    const admin = await requireAdmin(requestToken(req));
    const report = await updateReport(req.params.reportId, req.body.action, admin);
    await writeAdminAudit(admin, `report:${req.body.action}`, { reportId: req.params.reportId });

    await broadcastState();
    res.json({ report });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete("/api/admin/users/:userId", async (req, res) => {
  try {
    const admin = await requireAdmin(requestToken(req));
    await deleteUserAccount(req.params.userId);
    await writeAdminAudit(admin, "user:delete", { userId: req.params.userId });

    await broadcastState();
    res.json({ ok: true });
  } catch (error) {
    handleError(res, error);
  }
});

app.patch("/api/admin/users/:userId/status", async (req, res) => {
  try {
    const admin = await requireAdmin(requestToken(req));
    const user = await updateUserStatus(req.params.userId, req.body.status, req.body.reason, admin);

    await broadcastState();
    res.json({ user: sanitizeAdminUser(user) });
  } catch (error) {
    handleError(res, error);
  }
});

app.patch("/api/admin/messages/:messageId", async (req, res) => {
  try {
    const admin = await requireAdmin(requestToken(req));
    const message = await updateAdminMessage(req.params.messageId, req.body.action, admin);
    emitMessageUpdate(message);
    res.json({ message: serializeMessage(message) });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete("/api/admin/messages/:messageId", async (req, res) => {
  try {
    const admin = await requireAdmin(requestToken(req));
    const result = await deleteMessage(req.params.messageId, admin, "everyone");
    emitMessageDelete(result.message, "everyone");
    await writeAdminAudit(admin, "message:delete", { messageId: req.params.messageId });
    await broadcastRooms();
    res.json({ ok: true });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/admin/announcements", async (req, res) => {
  try {
    await requireAdmin(requestToken(req));
    res.json({ announcements: await listAnnouncements() });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/admin/announcements", async (req, res) => {
  try {
    const admin = await requireAdmin(requestToken(req));
    const announcement = await createAnnouncement(req.body.announcement || req.body, admin);
    await writeAdminAudit(admin, "announcement:create", { announcementId: announcement.id });
    emitAnnouncementNew(announcement);
    await broadcastState();
    res.status(201).json({ announcement });
  } catch (error) {
    handleError(res, error);
  }
});

app.patch("/api/admin/announcements/:announcementId", async (req, res) => {
  try {
    const admin = await requireAdmin(requestToken(req));
    const announcement = await updateAnnouncement(req.params.announcementId, req.body.announcement || req.body, admin);
    await writeAdminAudit(admin, "announcement:update", { announcementId: announcement.id });
    emitAnnouncementUpdate(announcement);
    await broadcastState();
    res.json({ announcement });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete("/api/admin/announcements/:announcementId", async (req, res) => {
  try {
    const admin = await requireAdmin(requestToken(req));
    const announcement = await deleteAnnouncement(req.params.announcementId);
    await writeAdminAudit(admin, "announcement:delete", { announcementId: announcement.id });
    emitAnnouncementDelete(announcement);
    await broadcastState();
    res.json({ ok: true, message: "Deleted", announcement });
  } catch (error) {
    handleError(res, error);
  }
});

app.get("/api/admin/settings", async (req, res) => {
  try {
    await requireAdmin(requestToken(req));
    res.json({ settings: await getPlatformSettings() });
  } catch (error) {
    handleError(res, error);
  }
});

app.patch("/api/admin/settings", async (req, res) => {
  try {
    const admin = await requireAdmin(requestToken(req));
    const settings = await savePlatformSettings(req.body.settings || {}, admin);
    await writeAdminAudit(admin, "settings:update", { settings });
    res.json({ settings });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/admin/rooms", async (req, res) => {
  try {
    const admin = await requireAdmin(requestToken(req));
    const room = await createAdminRoom(req.body.room || req.body, admin);
    await broadcastRooms();
    res.status(201).json({ room });
  } catch (error) {
    handleError(res, error);
  }
});

app.patch("/api/admin/rooms/:roomId", async (req, res) => {
  try {
    const admin = await requireAdmin(requestToken(req));
    const room = await updateAdminRoom(req.params.roomId, req.body.room || req.body, admin);
    await broadcastRooms();
    res.json({ room });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete("/api/admin/rooms/:roomId", async (req, res) => {
  try {
    const admin = await requireAdmin(requestToken(req));
    await deleteAdminRoom(req.params.roomId, admin);
    await broadcastRooms();
    res.json({ ok: true });
  } catch (error) {
    handleError(res, error);
  }
});

async function registerUser(body) {
  const fullName = cleanText(body.fullName, 60);
  const username = normalizeUsername(body.username);
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");
  const dateOfBirth = normalizeDateOfBirth(body.dateOfBirth);

  if (!fullName) throw createHttpError(400, "Full name is required.");

  validateUsername(username);
  validateEmail(email);
  validatePassword(password);

  await ensureNotDeleted(username, email);

  const publicName = await generateAnonymousName();
  const passwordSecret = hashPassword(password);

  const user = {
    id: createId("user"),
    fullName,
    username,
    email,
    dateOfBirth,
    emailDomain: emailDomain(email),
    campusVerified: isCampusEmail(email),
    anonymousName: publicName,
    about: "",
    avatarColor: pick(avatarColors),
    avatarDataUrl: "",
    role: "user",
    status: "active",
    provider: "password",
    password,
    passwordSalt: passwordSecret.salt,
    passwordHash: passwordSecret.hash,
    createdAt: Date.now(),
    lastSeen: Date.now(),
  };

  try {
    await db.collection("users").insertOne(user);
  } catch (error) {
    if (error.code === 11000) {
      throw createHttpError(409, "Username or email already exists.");
    }
    throw error;
  }

  const token = await createSession(user.id, "user");

  return { user: sanitizeUser(user), token };
}

async function loginUser(body) {
  const identifier = String(body.identifier || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!identifier) throw createHttpError(400, "Username or email is required.");
  if (!password) throw createHttpError(400, "Password is required.");

  const userDoc = await models.User.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  }).select("+password +passwordSalt +passwordHash");
  const user = userDoc ? normalizeDocument(userDoc.toObject({ versionKey: false })) : null;

  if (!user || !userDoc) {
    throw createHttpError(404, "Username or email not found.");
  }

  let passwordMatches = Boolean(user?.passwordSalt && user?.passwordHash && verifyPassword(password, user.passwordSalt, user.passwordHash));

  if (!passwordMatches && userDoc?.password) {
    const storedPassword = String(userDoc.password || "");
    const isBcryptHash = /^\$2[aby]\$\d{2}\$/.test(storedPassword);
    passwordMatches = isBcryptHash
      ? await userDoc.comparePassword(password)
      : storedPassword === password;

    if (passwordMatches && !isBcryptHash) {
      const migratedSecret = hashPassword(password);
      await db.collection("users").updateOne(
        { id: user.id },
        {
          $set: {
            password: "",
            passwordSalt: migratedSecret.salt,
            passwordHash: migratedSecret.hash,
            lastSeen: Date.now(),
          },
        }
      );
      user.password = "";
      user.passwordSalt = migratedSecret.salt;
      user.passwordHash = migratedSecret.hash;
    }
  }

  if (!passwordMatches) {
    throw createHttpError(401, "Incorrect password.");
  }

  ensureActiveUser(user);

  await db.collection("users").updateOne({ id: user.id }, { $set: { lastSeen: Date.now() } });

  const token = await createSession(user.id, "user");

  return { user: sanitizeUser({ ...user, lastSeen: Date.now() }), token };
}

async function loginAdmin(body) {
  const username = String(body.identifier || body.username || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    throw createHttpError(401, "Invalid admin credentials.");
  }

  const token = await createSession("site-admin", "admin");

  return { user: adminUser(), token };
}

function normalizeSocialProvider(provider) {
  const value = String(provider || "").trim().toLowerCase();
  if (!["google", "facebook"].includes(value)) {
    throw createHttpError(400, "Unsupported social login provider.");
  }
  return value;
}

function publicRequestOrigin(req) {
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const forwardedHost = String(req.headers["x-forwarded-host"] || "").split(",")[0].trim();
  const protocol = forwardedProto || req.protocol || "http";
  const host = forwardedHost || req.headers.host || `localhost:${PORT}`;
  return `${protocol}://${host}`;
}

function isLocalOriginValue(origin) {
  try {
    const url = new URL(origin);
    return ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  } catch {
    return false;
  }
}

function socialClientOrigin(req) {
  const origin = String(req.headers.origin || "").trim();
  const requestOrigin = publicRequestOrigin(req);

  if (isLocalOriginValue(origin)) return origin;
  if (isLocalOriginValue(requestOrigin)) {
    const requestUrl = new URL(requestOrigin);
    if (requestUrl.port === "5173") return requestOrigin;
    return process.env.LOCAL_CLIENT_URL || "http://localhost:5173";
  }

  return process.env.CLIENT_URL || origin || requestOrigin;
}

function socialRedirectUri(provider, req) {
  const explicit =
    provider === "google"
      ? process.env.GOOGLE_REDIRECT_URI
      : process.env.FACEBOOK_REDIRECT_URI;
  if (explicit) return explicit;

  const apiOrigin = process.env.PUBLIC_API_URL || process.env.SERVER_URL || publicRequestOrigin(req);
  return `${apiOrigin}/api/auth/social/${provider}/callback`;
}

function socialProviderConfig(provider, req) {
  if (provider === "google") {
    return {
      provider,
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirectUri: socialRedirectUri(provider, req),
      configured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      requiredEnv: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
    };
  }

  return {
    provider,
    clientId: process.env.FACEBOOK_APP_ID || process.env.FACEBOOK_CLIENT_ID || "",
    clientSecret: process.env.FACEBOOK_APP_SECRET || process.env.FACEBOOK_CLIENT_SECRET || "",
    redirectUri: socialRedirectUri(provider, req),
    configured: Boolean(
      (process.env.FACEBOOK_APP_ID || process.env.FACEBOOK_CLIENT_ID) &&
        (process.env.FACEBOOK_APP_SECRET || process.env.FACEBOOK_CLIENT_SECRET)
    ),
    requiredEnv: ["FACEBOOK_APP_ID", "FACEBOOK_APP_SECRET"],
  };
}

function createSocialAuthUrl(provider, config, input = {}, req) {
  const mode = ["login", "register"].includes(String(input.mode || "").toLowerCase())
    ? String(input.mode).toLowerCase()
    : "login";
  const rawDateOfBirth = String(input.dateOfBirth || "").trim();
  const dateOfBirth = rawDateOfBirth ? formatDateOfBirth(normalizeDateOfBirth(rawDateOfBirth)) : "";

  if (mode === "register" && !dateOfBirth) {
    throw createHttpError(400, "Select date of birth before social signup.");
  }

  const state = jwt.sign(
    {
      type: "social-oauth",
      provider,
      mode,
      dateOfBirth,
      origin: socialClientOrigin(req),
      nonce: crypto.randomBytes(12).toString("hex"),
    },
    JWT_SECRET,
    { expiresIn: "10m" }
  );

  if (provider === "google") {
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: "code",
      scope: "openid email profile",
      state,
      prompt: "select_account",
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: "email,public_profile",
    state,
  });
  return `https://www.facebook.com/dialog/oauth?${params.toString()}`;
}

function verifySocialState(provider, rawState) {
  const state = String(rawState || "").trim();
  if (!state) throw createHttpError(400, "Missing social login state.");

  let decoded;
  try {
    decoded = jwt.verify(state, JWT_SECRET);
  } catch {
    throw createHttpError(400, "Social login session expired. Please try again.");
  }

  if (decoded?.type !== "social-oauth" || decoded?.provider !== provider) {
    throw createHttpError(400, "Invalid social login state.");
  }

  return decoded;
}

async function fetchGoogleProfile(code, config) {
  const tokenPayload = await fetchFormJson("https://oauth2.googleapis.com/token", {
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
    grant_type: "authorization_code",
  });

  const accessToken = tokenPayload.access_token;
  if (!accessToken) throw createHttpError(502, "Google did not return an access token.");

  const profile = await fetchBearerJson("https://openidconnect.googleapis.com/v1/userinfo", accessToken);
  return {
    id: profile.sub,
    email: profile.email,
    emailVerified: Boolean(profile.email_verified),
    name: profile.name,
    avatarDataUrl: profile.picture,
  };
}

async function fetchFacebookProfile(code, config) {
  const tokenUrl = new URL("https://graph.facebook.com/oauth/access_token");
  tokenUrl.search = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
    code,
  }).toString();

  const tokenPayload = await fetchJsonUrl(tokenUrl.toString());
  const accessToken = tokenPayload.access_token;
  if (!accessToken) throw createHttpError(502, "Facebook did not return an access token.");

  const profileUrl = new URL("https://graph.facebook.com/me");
  profileUrl.search = new URLSearchParams({
    fields: "id,name,email,picture.width(256).height(256)",
    access_token: accessToken,
  }).toString();

  const profile = await fetchJsonUrl(profileUrl.toString());
  return {
    id: profile.id,
    email: profile.email,
    emailVerified: Boolean(profile.email),
    name: profile.name,
    avatarDataUrl: profile.picture?.data?.url || "",
  };
}

async function loginSocialUser(provider, profile, statePayload = {}) {
  const email = normalizeEmail(profile.email);
  const providerId = cleanText(profile.id, 120);
  if (!email) throw createHttpError(400, `${capitalize(provider)} did not provide an email address.`);
  validateEmail(email);

  const fullName = cleanText(profile.name || email.split("@")[0] || `${capitalize(provider)} User`, 60);
  await ensureNotDeleted(`social_${provider}_${providerId || "user"}`, email);

  const existingDoc = await models.User.findOne({
    $or: [
      { email },
      ...(providerId ? [{ provider, providerId }] : []),
    ],
  }).select("+password +passwordSalt +passwordHash");

  if (existingDoc) {
    const existing = normalizeDocument(existingDoc.toObject({ versionKey: false }));
    ensureActiveUser(existing);

    const updates = {
      lastSeen: Date.now(),
      provider: existing.provider === "password" ? existing.provider : provider,
      providerId: providerId || existing.providerId || "",
    };

    if (!existing.fullName && fullName) updates.fullName = fullName;
    if (!existing.avatarDataUrl && profile.avatarDataUrl) updates.avatarDataUrl = cleanText(profile.avatarDataUrl, 1000);

    await db.collection("users").updateOne({ id: existing.id }, { $set: updates });
    const token = await createSession(existing.id, "user");
    return { user: sanitizeUser({ ...existing, ...updates }), token };
  }

  if (statePayload.mode !== "register") {
    throw createHttpError(404, `No account found for ${email}. Open Register and select date of birth first.`);
  }

  const dateOfBirth = normalizeDateOfBirth(statePayload.dateOfBirth);
  const username = await generateSocialUsername(fullName, email);
  const publicName = await generateAnonymousName();
  const randomPassword = `${crypto.randomBytes(18).toString("base64url")}A1!`;
  const passwordSecret = hashPassword(randomPassword);
  const user = {
    id: createId("user"),
    fullName,
    username,
    email,
    dateOfBirth,
    emailDomain: emailDomain(email),
    campusVerified: isCampusEmail(email) || Boolean(profile.emailVerified),
    anonymousName: publicName,
    about: "",
    avatarColor: pick(avatarColors),
    avatarDataUrl: cleanText(profile.avatarDataUrl, 1000),
    role: "user",
    status: "active",
    provider,
    providerId,
    password: randomPassword,
    passwordSalt: passwordSecret.salt,
    passwordHash: passwordSecret.hash,
    createdAt: Date.now(),
    lastSeen: Date.now(),
  };

  try {
    await db.collection("users").insertOne(user);
  } catch (error) {
    if (error.code === 11000) {
      throw createHttpError(409, "A user with this email already exists. Try logging in.");
    }
    throw error;
  }

  const token = await createSession(user.id, "user");
  return { user: sanitizeUser(user), token };
}

async function generateSocialUsername(fullName, email) {
  const source = String(email || fullName || "user").split("@")[0] || "user";
  const base = source
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 16) || "user";
  const safeBase = base.length >= 3 ? base : `user_${base}`;

  for (let index = 0; index < 30; index += 1) {
    const suffix = index === 0 ? "" : `_${randomNumber(10, 9999)}`;
    const candidate = `${safeBase}${suffix}`.slice(0, 24);
    if (/^[a-z0-9_]{3,24}$/.test(candidate)) {
      const exists = await db.collection("users").findOne({ username: candidate }, { projection: { id: 1 } });
      if (!exists) return candidate;
    }
  }

  return `user_${crypto.randomBytes(5).toString("hex")}`.slice(0, 24);
}

async function fetchFormJson(url, form) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(form).toString(),
  });
  return parseProviderResponse(response);
}

async function fetchBearerJson(url, token) {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseProviderResponse(response);
}

async function fetchJsonUrl(url) {
  const response = await fetch(url);
  return parseProviderResponse(response);
}

async function parseProviderResponse(response) {
  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { error: text };
  }

  if (!response.ok) {
    const message =
      payload.error_description ||
      payload.error?.message ||
      payload.error ||
      "Social provider request failed.";
    throw createHttpError(response.status, message);
  }

  return payload;
}

function sendSocialAuthPopupResult(res, payload) {
  const origin = payload.origin || "";
  const safePayload = safeScriptJson({
    type: "anonchat:social-auth",
    ok: Boolean(payload.ok),
    error: payload.error || "",
    session: payload.session || null,
  });
  const safeOrigin = safeScriptJson(origin);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AnonChat Social Login</title>
  <style>
    body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0a0b14;color:#fff;font-family:system-ui,sans-serif}
    main{width:min(420px,calc(100vw - 32px));padding:28px;border:1px solid rgba(255,255,255,.1);border-radius:16px;background:rgba(17,18,28,.9);text-align:center}
    p{color:rgba(232,234,240,.72);line-height:1.5}
  </style>
</head>
<body>
  <main>
    <h1>AnonChat</h1>
    <p id="message">${payload.ok ? "Login successful. Returning to AnonChat..." : escapeHtml(payload.error || "Social login failed.")}</p>
  </main>
  <script>
    (function () {
      var payload = ${safePayload};
      var targetOrigin = ${safeOrigin} || window.location.origin;
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(payload, targetOrigin);
          window.setTimeout(function () { window.close(); }, 250);
          return;
        }
      } catch (error) {}
      if (payload.ok && payload.session) {
        try { localStorage.setItem("anonchat-session-v4", JSON.stringify(payload.session)); } catch (error) {}
        window.location.href = "/chat";
        return;
      }
      document.getElementById("message").textContent = payload.error || "Social login failed.";
    })();
  </script>
</body>
</html>`);
}

function safeScriptJson(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function requestPasswordReset(emailInput) {
  const email = normalizeEmail(emailInput);

  if (!email) throw createHttpError(400, "Email is required.");
  validateEmail(email);

  const user = await db.collection("users").findOne({ email });

  if (!user) {
    throw createHttpError(404, "Email not found.");
  }

  const otp = String(randomNumber(100000, 999999));
  const expiresAt = new Date(Date.now() + RESET_OTP_MINUTES * 60 * 1000);

  await db.collection("passwordResets").updateMany(
    { email, used: false },
    {
      $set: {
        used: true,
        usedAt: Date.now(),
      },
    }
  );

  await db.collection("passwordResets").insertOne({
    id: createId("reset"),
    userId: user.id,
    email,
    otpHash: hashToken(otp),
    resetTokenHash: hashToken(crypto.randomBytes(24).toString("hex")),
    otpVerified: false,
    verifiedAt: null,
    used: false,
    createdAt: Date.now(),
    expiresAt,
  });

  const emailSent = await sendPasswordResetOtp(user, otp);

  const response = {
    ok: true,
    success: true,
    message: "OTP sent successfully.",
  };

  if (process.env.NODE_ENV !== "production" && !emailSent) {
    response.devOtp = otp;
  }

  return response;
}

async function verifyResetOtp(body) {
  const email = normalizeEmail(body.email);
  const otp = String(body.otp || "").trim();

  if (!email) throw createHttpError(400, "Email is required.");
  validateEmail(email);
  if (!/^\d{6}$/.test(otp)) throw createHttpError(400, "Invalid OTP.");

  const reset = await models.PasswordReset.findOne({ email, used: false })
    .sort({ createdAt: -1 })
    .select("+otpHash +resetTokenHash")
    .lean();

  if (!reset) throw createHttpError(400, "Invalid OTP.");
  if (resetIsExpired(reset)) throw createHttpError(410, "OTP expired.");
  if (reset.otpHash !== hashToken(otp)) throw createHttpError(400, "Invalid OTP.");

  const resetToken = crypto.randomBytes(32).toString("hex");
  await db.collection("passwordResets").updateOne(
    { id: reset.id },
    {
      $set: {
        resetTokenHash: hashToken(resetToken),
        otpVerified: true,
        verifiedAt: Date.now(),
      },
    }
  );

  return {
    ok: true,
    success: true,
    resetToken,
    message: "OTP verified.",
  };
}

async function resetPassword(body) {
  const email = normalizeEmail(body.email);
  const resetToken = String(body.resetToken || "").trim();
  const password = String(body.password || "");
  const username = normalizeUsername(body.username);

  if (!email) throw createHttpError(400, "Email is required.");
  validateEmail(email);
  if (!resetToken) throw createHttpError(400, "Please verify the OTP first.");
  validatePassword(password);
  if (username) validateUsername(username);

  const reset = await models.PasswordReset.findOne({
    email,
    resetTokenHash: hashToken(resetToken),
    used: false,
  })
    .select("+resetTokenHash")
    .lean();

  if (!reset || !reset.otpVerified) {
    throw createHttpError(400, "Please verify the OTP first.");
  }

  if (resetIsExpired(reset)) throw createHttpError(410, "OTP expired.");

  const userDoc = await models.User.findOne({ id: reset.userId }).select("+password +passwordSalt +passwordHash");
  if (!userDoc) throw createHttpError(404, "User not found.");

  if (username && username !== normalizeUsername(userDoc.username)) {
    const existing = await models.User.findOne({
      username,
      id: { $ne: userDoc.id },
    }).lean();
    if (existing) throw createHttpError(409, "Username is already taken.");
    userDoc.username = username;
  }

  userDoc.password = password;
  userDoc.passwordSalt = "";
  userDoc.passwordHash = "";
  userDoc.passwordResetOtp = null;
  userDoc.passwordResetToken = null;
  userDoc.passwordResetExpiry = null;
  userDoc.lastSeen = Date.now();
  await userDoc.save();

  await db.collection("sessions").deleteMany({ userId: reset.userId });
  clearTokenCacheForUser(reset.userId);
  await db.collection("passwordResets").updateMany(
    { userId: reset.userId, used: false },
    {
      $set: {
        used: true,
        usedAt: Date.now(),
      },
    }
  );

  return { ok: true, success: true, message: "Password reset successful." };
}

async function sendPasswordResetOtp(user, otp) {
  if (!transporter) {
    if (process.env.NODE_ENV === "production") {
      throw createHttpError(500, "Email service is not configured.");
    }
    devLog(`Password reset OTP for ${user.email}: ${otp}`);
    return false;
  }

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: user.email,
    subject: "AnonChat Password Reset OTP",
    html: `
      <div style="font-family:sans-serif;
        max-width:400px;margin:0 auto;
        background:#0a0b14;color:#e8eaf0;
        padding:32px;border-radius:12px">
        <h2 style="color:#a78bfa">
          Reset Your Password
        </h2>
        <p>Your OTP code is:</p>
        <div style="font-size:36px;
          font-weight:700;
          color:#6c63ff;
          letter-spacing:8px;
          text-align:center;
          padding:16px;
          background:rgba(108,99,255,0.1);
          border-radius:8px;
          margin:16px 0">
          ${otp}
        </div>
        <p style="color:rgba(232,234,240,0.5);
          font-size:12px">
          This OTP expires in ${RESET_OTP_MINUTES} minutes.
          Do not share it with anyone.
        </p>
      </div>
    `,
  });

  return true;
}

function runSingleUpload(fieldName) {
  return (req, res, next) => {
    uploadMemory.single(fieldName)(req, res, (error) => {
      if (!error) {
        next();
        return;
      }

      const message =
        error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE"
          ? "File is too large. Keep uploads under 8 MB."
          : error.message || "Upload failed.";
      handleError(res, createHttpError(400, message));
    });
  };
}

async function uploadChatFile(file, user) {
  const mimeType = normalizeMimeType(file.mimetype || "application/octet-stream");
  const name = cleanText(file.originalname || "attachment", 120);
  const size = Number(file.size || 0);
  const kind = attachmentKindFromMime(mimeType);

  validateUploadPayload({ mimeType, size, kind });

  const dataUrl = bufferToDataUrl(file.buffer, mimeType);
  const uploaded = await uploadBase64Media({
    dataUrl,
    folder: `anonchat/messages/${user.id}`,
    allowedKinds: new Set(["image", "video", "audio", "file"]),
    maxBytes: MAX_ATTACHMENT_BYTES,
    publicId: `chat_${user.id}_${Date.now()}`,
  });

  return {
    kind,
    name,
    mimeType,
    size,
    url: uploaded.url || uploaded.dataUrl,
    dataUrl: uploaded.dataUrl || uploaded.url,
    publicId: uploaded.publicId || "",
    storage: uploaded.storage,
  };
}

async function uploadBase64Media({ dataUrl, folder, allowedKinds, maxBytes = MAX_ATTACHMENT_BYTES, publicId = "" }) {
  const parsed = parseDataUrl(dataUrl);
  const kind = attachmentKindFromMime(parsed.mimeType);
  if (allowedKinds && !allowedKinds.has(kind)) {
    throw createHttpError(400, "This file type is not supported here.");
  }

  validateUploadPayload({
    mimeType: parsed.mimeType,
    size: parsed.size,
    kind,
    maxBytes,
    dataUrl,
  });

  if (!cloudinaryConfigured) {
    return {
      storage: "base64",
      url: dataUrl,
      dataUrl,
      mimeType: parsed.mimeType,
      size: parsed.size,
      publicId: "",
    };
  }

  const uploaded = await cloudinary.uploader.upload(dataUrl, {
    folder,
    public_id: publicId || undefined,
    resource_type: "auto",
    overwrite: true,
  });

  return {
    storage: "cloudinary",
    url: uploaded.secure_url,
    dataUrl: uploaded.secure_url,
    mimeType: parsed.mimeType,
    size: parsed.size,
    publicId: uploaded.public_id || "",
  };
}

function parseDataUrl(dataUrl) {
  const value = String(dataUrl || "");
  const match = value.match(/^data:([^;,]+)(?:;[^,]*)?;base64,([A-Za-z0-9+/=\r\n]+)$/);
  if (!match) throw createHttpError(400, "Invalid upload data.");

  const mimeType = normalizeMimeType(match[1]);
  const base64 = match[2].replace(/\s/g, "");
  const size = Buffer.byteLength(base64, "base64");
  return { mimeType, base64, size };
}

function bufferToDataUrl(buffer, mimeType) {
  return `data:${mimeType};base64,${Buffer.from(buffer || []).toString("base64")}`;
}

function attachmentKindFromMime(mimeType) {
  const type = normalizeMimeType(mimeType);
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  return "file";
}

function normalizeMimeType(mimeType) {
  return cleanText(String(mimeType || "application/octet-stream").split(";")[0].trim().toLowerCase(), 120) || "application/octet-stream";
}

function validateUploadPayload({ mimeType, size, kind, maxBytes = MAX_ATTACHMENT_BYTES, dataUrl = "" }) {
  if (!ALLOWED_ATTACHMENT_TYPES.has(mimeType)) {
    throw createHttpError(400, "This file type is not supported yet.");
  }

  if (!["image", "video", "audio", "file"].includes(kind)) {
    throw createHttpError(400, "Unsupported attachment type.");
  }

  if (!Number.isFinite(size) || size <= 0 || size > maxBytes) {
    throw createHttpError(400, `File is too large. Keep uploads under ${Math.round(maxBytes / 1024 / 1024)} MB.`);
  }

  if (dataUrl && dataUrl.length > maxBytes * 1.5 + 200) {
    throw createHttpError(400, `File is too large. Keep uploads under ${Math.round(maxBytes / 1024 / 1024)} MB.`);
  }
}

function resetIsExpired(reset) {
  return !reset?.expiresAt || new Date(reset.expiresAt).getTime() <= Date.now();
}

async function createMessage(user, body) {
  const room = await db.collection("rooms").findOne({ id: body.roomId });
  const text = cleanText(body.text, 280);
  const attachment = normalizeAttachment(body.attachment);
  const replyToMessageId = cleanText(body.replyToMessageId || "", 80);
  const clientTempId = cleanClientTempId(body.clientTempId);

  if (!room) throw createHttpError(404, "Room not found.");
  await requireRoomEntry(room, user);
  if (room.locked || (room.lockedUntil && Number(room.lockedUntil) > Date.now())) {
    throw createHttpError(423, "This room is temporarily locked by moderation.");
  }
  if (!text && !attachment) throw createHttpError(400, "Message cannot be empty.");

  if (clientTempId) {
    const existing = await db.collection("messages").findOne({
      roomId: room.id,
      authorId: user.id,
      clientTempId,
    });

    if (existing) return { message: existing, report: null, deduped: true };
  }

  const moderation = moderateText(text);
  const flagged = moderation.flagged;
  const replyTo = replyToMessageId ? await getReplyPreview(replyToMessageId, room.id) : null;
  const createdAt = Date.now();

  const message = {
    id: createId("msg"),
    clientTempId,
    roomId: room.id,
    authorId: user.id,
    author: user.anonymousName,
    username: user.username || "",
    about: user.about || "",
    customStatus: user.customStatus || "",
    department: user.department || "",
    campus: user.campus || "",
    joinedAt: user.createdAt || Date.now(),
    avatarColor: user.avatarColor,
    avatarDataUrl: user.avatarDataUrl || "",
    text,
    type: attachment ? "media" : "text",
    attachment,
    replyTo,
    createdAt,
    editedAt: null,
    reactions: 0,
    reactedBy: [],
    reactionSummary: {},
    reactionsByUser: {},
    deletedFor: [],
    delivery: {
      sentAt: createdAt,
      deliveredTo: [],
      seenBy: [],
    },
    reported: flagged,
    moderationReasons: moderation.reasons,
    hidden: false,
  };

  await db.collection("messages").insertOne(message);

  let report = null;

  if (flagged) {
    report = await createReport(message.id, `Auto moderation: ${moderation.reasons.join(", ")}`, user.id);
  }

  return { message, report };
}

async function createPollMessage(user, body) {
  const room = await db.collection("rooms").findOne({ id: body.roomId });
  const question = cleanText(body.question, 140);
  const options = Array.isArray(body.options)
    ? body.options.map((option) => cleanText(option, 60)).filter(Boolean).slice(0, 6)
    : [];

  if (!room) throw createHttpError(404, "Room not found.");
  await requireRoomEntry(room, user);
  if (!question) throw createHttpError(400, "Poll question is required.");
  if (options.length < 2) throw createHttpError(400, "Add at least two poll options.");

  const createdAt = Date.now();
  const message = {
    id: createId("msg"),
    roomId: room.id,
    authorId: user.id,
    author: user.anonymousName,
    avatarColor: user.avatarColor,
    avatarDataUrl: user.avatarDataUrl || "",
    text: question,
    type: "poll",
    poll: {
      question,
      options: options.map((text) => ({
        id: createId("opt"),
        text,
        votes: 0,
        votedBy: [],
      })),
    },
    attachment: null,
    replyTo: null,
    createdAt,
    editedAt: null,
    reactions: 0,
    reactedBy: [],
    reactionSummary: {},
    reactionsByUser: {},
    deletedFor: [],
    delivery: {
      sentAt: createdAt,
      deliveredTo: [],
      seenBy: [],
    },
    reported: false,
    moderationReasons: [],
    hidden: false,
  };

  await db.collection("messages").insertOne(message);

  return { message };
}

async function votePoll(messageId, optionId, userId) {
  const message = await db.collection("messages").findOne({ id: messageId, type: "poll" });

  if (!message) throw createHttpError(404, "Poll not found.");

  const options = message.poll.options.map((option) => {
    const votedBy = Array.isArray(option.votedBy) ? option.votedBy.filter((id) => id !== userId) : [];
    const selected = option.id === optionId;
    const nextVotedBy = selected ? [...votedBy, userId] : votedBy;

    return {
      ...option,
      votedBy: nextVotedBy,
      votes: nextVotedBy.length,
    };
  });

  if (!options.some((option) => option.id === optionId)) {
    throw createHttpError(404, "Poll option not found.");
  }

  await db.collection("messages").updateOne(
    { id: messageId },
    { $set: { "poll.options": options } }
  );

  return await db.collection("messages").findOne({ id: messageId });
}

async function getReplyPreview(messageId, roomId) {
  const message = await db.collection("messages").findOne({
    id: messageId,
    roomId,
    hidden: { $ne: true },
  });

  if (!message) return null;

  return {
    id: message.id,
    author: message.author,
    text: cleanText(message.text || message.attachment?.name || "", 120),
    attachment: message.attachment
      ? {
          kind: message.attachment.kind,
          name: message.attachment.name,
          voiceNote: Boolean(message.attachment.voiceNote),
        }
      : null,
  };
}

function handleTyping(user, body) {
  const roomId = String(body.roomId || "");
  const isTyping = Boolean(body.isTyping);

  if (!roomId) return;

  if (isTyping) {
    typingUsers.set(user.id, {
      userId: user.id,
      name: user.anonymousName,
      roomId,
      expiresAt: Date.now() + 3500,
    });
  } else {
    typingUsers.delete(user.id);
  }

  emitTyping(user, roomId, isTyping);
}

function normalizeReactionEmoji(emoji) {
  const value = cleanText(emoji || "", 8);
  const allowed = new Set(["\u{1F44D}", "\u2764\uFE0F", "\u{1F602}", "\u{1F62E}", "\u{1F622}", "\u{1F525}"]);
  return allowed.has(value) ? value : "\u{1F44D}";
}

function summarizeReactions(reactionsByUser = {}) {
  return Object.values(reactionsByUser).reduce((summary, emoji) => {
    summary[emoji] = (summary[emoji] || 0) + 1;
    return summary;
  }, {});
}

async function toggleReaction(messageId, userId, emojiInput) {
  const message = await db.collection("messages").findOne({ id: messageId });

  if (!message) throw createHttpError(404, "Message not found.");

  const emoji = normalizeReactionEmoji(emojiInput);
  const legacyReactedBy = Array.isArray(message.reactedBy) ? message.reactedBy : [];
  const reactionsByUser = {
    ...legacyReactedBy.reduce((map, id) => ({ ...map, [id]: "\u{1F44D}" }), {}),
    ...(message.reactionsByUser || {}),
  };

  if (reactionsByUser[userId] === emoji) {
    delete reactionsByUser[userId];
  } else {
    reactionsByUser[userId] = emoji;
  }

  const reactionSummary = summarizeReactions(reactionsByUser);
  const updatedReactedBy = Object.keys(reactionsByUser);
  const totalReactions = updatedReactedBy.length;

  await db.collection("messages").updateOne(
    { id: messageId },
    {
      $set: {
        reactedBy: updatedReactedBy,
        reactions: totalReactions,
        reactionSummary,
        reactionsByUser,
      },
    }
  );

  return {
    ...message,
    reactedBy: updatedReactedBy,
    reactions: totalReactions,
    reactionSummary,
    reactionsByUser,
  };
}

async function editMessage(messageId, user, nextText) {
  const message = await db.collection("messages").findOne({ id: messageId });
  const text = cleanText(nextText, 280);

  if (!message) throw createHttpError(404, "Message not found.");

  if (message.authorId !== user.id) {
    throw createHttpError(403, "You can edit only your own message.");
  }

  if (Date.now() - Number(message.createdAt || 0) > EDIT_WINDOW_MS) {
    throw createHttpError(403, "Messages can be edited only within 5 minutes.");
  }

  if (!text) throw createHttpError(400, "Message cannot be empty.");

  await db.collection("messages").updateOne(
    { id: messageId },
    {
      $set: {
        text,
        editedAt: Date.now(),
      },
    }
  );

  return await db.collection("messages").findOne({ id: messageId });
}

async function deleteMessage(messageId, user, scope = "everyone") {
  const message = await db.collection("messages").findOne({ id: messageId });

  if (!message) throw createHttpError(404, "Message not found.");

  const deleteScope = scope === "me" ? "me" : "everyone";

  if (deleteScope === "me") {
    await db.collection("messages").updateOne(
      { id: messageId },
      { $addToSet: { deletedFor: user.id } }
    );

    return { scope: "me", message: { ...message, deletedFor: [...(message.deletedFor || []), user.id] } };
  }

  if (message.authorId !== user.id && user.role !== "admin") {
    throw createHttpError(403, "You can delete for everyone only on your own message.");
  }

  if (user.role !== "admin") {
    const deletedAt = Date.now();
    await db.collection("messages").updateOne(
      { id: messageId },
      {
        $set: {
          text: "This message was deleted",
          type: "text",
          attachment: null,
          poll: null,
          deletedAt,
          deletedBy: user.id,
          editedAt: null,
          reactions: 0,
          reactedBy: [],
          reactionSummary: {},
          reactionsByUser: {},
        },
      }
    );

    return {
      scope: "everyone",
      message: {
        ...message,
        text: "This message was deleted",
        type: "text",
        attachment: null,
        poll: null,
        deletedAt,
        deletedBy: user.id,
        editedAt: null,
        reactions: 0,
        reactedBy: [],
        reactionSummary: {},
        reactionsByUser: {},
      },
    };
  }

  await db.collection("messages").deleteOne({ id: messageId });
  await db.collection("reports").deleteMany({
    $or: [
      { messagePublicId: messageId },
      { messageId: isMongoObjectId(message._id) ? message._id : undefined },
    ].filter((item) => Object.values(item)[0] !== undefined),
  });

  return { scope: "everyone", message };
}

async function createReport(messageId, reason, reporterId) {
  const message = await db.collection("messages").findOne({ id: messageId });

  if (!message) throw createHttpError(404, "Message not found.");

  const reporter = await db.collection("users").findOne({ id: reporterId });
  const reportedUser = message.authorId ? await db.collection("users").findOne({ id: message.authorId }) : null;
  const reasonText = cleanText(reason || "Other", 160);

  const report = {
    id: createId("rep"),
    messageId: objectIdFromValue(message._id || message.id),
    messagePublicId: message.id,
    reportedUserId: reportedUser?._id ? objectIdFromValue(reportedUser._id) : null,
    reportedUserPublicId: message.authorId || "",
    reporterId: objectIdFromValue(reporter?._id || reporterId),
    reporterPublicId: reporterId,
    reporterName: reporter?.anonymousName || reporter?.fullName || "Anonymous",
    reason: normalizeReportReason(reasonText),
    reasonText,
    status: "open",
    roomId: message.roomId || "",
    message: removeMongoId(message),
    createdAt: Date.now(),
    resolvedAt: null,
  };

  await db.collection("messages").updateOne(
    { id: messageId },
    { $set: { reported: true } }
  );

  await db.collection("reports").insertOne(report);
  io.emit("report:new", removeMongoId(report));
  if (/auto moderation|threat|hate|harassment|spam/i.test(reasonText)) {
    io.emit("admin:moderation-alert", {
      id: report.id,
      roomId: report.roomId,
      reason: report.reasonText,
      user: reportedUser?.anonymousName || message.author || "Anonymous User",
      messagePreview: cleanText(message.text || message.attachment?.name || "Attachment", 120),
      createdAt: report.createdAt,
    });
  }

  return report;
}

async function updateReport(reportId, action, admin = null) {
  const report = await db.collection("reports").findOne({ id: reportId });

  if (!report) throw createHttpError(404, "Report not found.");

  const message = await findMessageForReport(report);
  const resolver = admin ? objectIdFromValue(admin.id) : null;

  if (action === "hide") {
    await db.collection("reports").updateOne(
      { id: reportId },
      { $set: { status: "hidden", resolvedAt: Date.now(), resolvedBy: resolver } }
    );

    if (message) {
      await db.collection("messages").updateOne(
        { id: message.id },
        { $set: { hidden: true, reported: true } }
      );
    }
  } else if (action === "dismiss") {
    await db.collection("reports").updateOne(
      { id: reportId },
      { $set: { status: "dismissed", resolvedAt: Date.now(), resolvedBy: resolver } }
    );

    if (message) {
      await db.collection("messages").updateOne(
        { id: message.id },
        { $set: { reported: false } }
      );
    }
  } else if (action === "resolve") {
    await db.collection("reports").updateOne(
      { id: reportId },
      { $set: { status: "hidden", resolvedAt: Date.now(), resolvedBy: resolver, adminNote: "Resolved by admin action." } }
    );

    if (message) {
      await db.collection("messages").updateOne(
        { id: message.id },
        { $set: { reported: true, hidden: true } }
      );
    }
  } else if (action === "restore") {
    await db.collection("reports").updateOne(
      { id: reportId },
      { $set: { status: "open", resolvedAt: null, resolvedBy: null, adminNote: "" } }
    );

    if (message) {
      await db.collection("messages").updateOne(
        { id: message.id },
        { $set: { hidden: false, reported: true } }
      );
    }
  } else if (action === "delete") {
    if (message) {
      await db.collection("messages").deleteOne({ id: message.id });
    }

    await db.collection("reports").updateOne(
      { id: reportId },
      { $set: { status: "deleted", resolvedAt: Date.now(), resolvedBy: resolver } }
    );
  } else {
    throw createHttpError(400, "Unknown moderation action.");
  }

  return await db.collection("reports").findOne({ id: reportId });
}

async function findMessageForReport(report) {
  if (report.messagePublicId) {
    const message = await db.collection("messages").findOne({ id: report.messagePublicId });
    if (message) return message;
  }

  if (report.message?.id) {
    const message = await db.collection("messages").findOne({ id: report.message.id });
    if (message) return message;
  }

  if (report.messageId && isMongoObjectId(report.messageId)) {
    return await db.collection("messages").findOne({ _id: report.messageId });
  }

  return null;
}

function normalizeReportReason(reason) {
  const value = String(reason || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (value.includes("harass")) return "harassment";
  if (value.includes("spam")) return "spam";
  if (value.includes("hate")) return "hate_speech";
  if (value.includes("threat")) return "threats";
  if (value.includes("misinformation") || value.includes("misinfo") || value.includes("fake")) return "misinformation";
  if (value.includes("inappropriate") || value.includes("explicit") || value.includes("nsfw") || value.includes("blocked_word")) {
    return "inappropriate_content";
  }

  return "other";
}

async function writeAdminAudit(admin, action, meta = {}) {
  const adminPublicId = admin?.id || "site-admin";

  await db.collection("adminAuditLogs").insertOne({
    id: createId("audit"),
    adminId: objectIdFromValue(adminPublicId),
    adminPublicId,
    adminName: admin?.name || ADMIN_NAME,
    action,
    targetType: inferAuditTargetType(action, meta),
    targetId: inferAuditTargetId(meta),
    meta,
  });
}

function inferAuditTargetType(action, meta = {}) {
  const prefix = String(action || "").split(":")[0];
  if (AUDIT_TARGET_TYPES.has(prefix)) return prefix;
  if (meta.settings) return "settings";
  return "settings";
}

function inferAuditTargetId(meta = {}) {
  return (
    meta.userId ||
    meta.messageId ||
    meta.roomId ||
    meta.reportId ||
    meta.announcementId ||
    null
  );
}

async function updateProfile(user, profile) {
  const privacySettings = profile.privacySettings && typeof profile.privacySettings === "object"
    ? {
        lastSeen: profile.privacySettings.lastSeen === "nobody" ? "nobody" : "everyone",
        profilePhoto: profile.privacySettings.profilePhoto === "nobody" ? "nobody" : "everyone",
        anonymousMode: profile.privacySettings.anonymousMode !== false,
        readReceipts: profile.privacySettings.readReceipts !== false,
        allowCalls: ["everyone", "my-rooms", "nobody"].includes(profile.privacySettings.allowCalls)
          ? profile.privacySettings.allowCalls
          : "everyone",
        onlineVisibility: profile.privacySettings.onlineVisibility === "nobody" ? "nobody" : "everyone",
      }
    : user.privacySettings || undefined;

  const updates = {
    fullName: cleanText(profile.fullName || user.fullName, 60),
    anonymousName: cleanText(profile.anonymousName || user.anonymousName, 40),
    about: cleanText(profile.about || "", 180),
    customStatus: cleanText(profile.customStatus || "", 80),
    themePreference: ["dark", "light", "system"].includes(profile.themePreference)
      ? profile.themePreference
      : user.themePreference || "dark",
    gender: normalizeGender(profile.gender),
    department: cleanText(profile.department || "", 60),
    studyYear: normalizeStudyYear(profile.studyYear),
    contactNumber: normalizeContact(profile.contactNumber || user.contactNumber),
    lastSeen: Date.now(),
  };

  if (privacySettings) updates.privacySettings = privacySettings;

  validateContact(updates.contactNumber);

  if (typeof profile.avatarDataUrl === "string") {
    const avatarDataUrl = profile.avatarDataUrl.trim();
    const isImageDataUrl = avatarDataUrl.startsWith("data:image/");
    const isImageUrl = /^https?:\/\/.+/i.test(avatarDataUrl);

    if (avatarDataUrl && !isImageDataUrl && !isImageUrl) {
      throw createHttpError(400, "Profile photo must be an image.");
    }

    if (isImageDataUrl && avatarDataUrl.length > 2 * 1024 * 1024 * 1.5) {
      throw createHttpError(400, "Profile photo is too large. Use a smaller image.");
    }

    if (isImageUrl && avatarDataUrl.length > 1000) {
      throw createHttpError(400, "Profile photo URL is too long.");
    }

    updates.avatarDataUrl = avatarDataUrl;
  }

  await db.collection("users").updateOne({ id: user.id }, { $set: updates });

  const nextAvatarDataUrl = Object.prototype.hasOwnProperty.call(updates, "avatarDataUrl")
    ? updates.avatarDataUrl
    : user.avatarDataUrl || "";

  await db.collection("messages").updateMany(
    { authorId: user.id },
    {
      $set: {
        author: updates.anonymousName,
        avatarDataUrl: nextAvatarDataUrl,
        username: user.username || "",
        about: updates.about || "",
        customStatus: updates.customStatus || "",
        department: updates.department || "",
        campus: user.campus || "",
        joinedAt: user.createdAt || Date.now(),
      },
    }
  );
  clearTokenCacheForUser(user.id);

  return await db.collection("users").findOne({ id: user.id });
}

async function changeUserPassword(user, body) {
  const currentPassword = String(body.currentPassword || "");
  const newPassword = String(body.newPassword || "");
  const confirmPassword = String(body.confirmPassword || "");

  if (!currentPassword) throw createHttpError(400, "Current password is required.");
  validatePassword(newPassword);
  if (newPassword !== confirmPassword) throw createHttpError(400, "New passwords do not match.");

  const userDoc = await models.User.findOne({ id: user.id }).select("+password +passwordSalt +passwordHash");
  if (!userDoc) throw createHttpError(404, "User not found.");
  const matches = await userDoc.comparePassword(currentPassword);
  if (!matches) throw createHttpError(400, "Current password is incorrect.");

  userDoc.password = newPassword;
  userDoc.passwordSalt = "";
  userDoc.passwordHash = "";
  userDoc.lastSeen = Date.now();
  await userDoc.save();
  clearTokenCacheForUser(user.id);
}

async function listBlockedUsers(user) {
  const blockedObjectIds = (user.blockedUsers || []).map(String).filter(Boolean);
  const blockedRecords = Array.isArray(user.blockedUserRecords) ? user.blockedUserRecords : [];
  const blockedPublicIds = blockedRecords.map((record) => String(record.userId || "")).filter(Boolean);

  if (!blockedObjectIds.length && !blockedPublicIds.length) return [];

  const filters = [];
  if (blockedObjectIds.length) filters.push({ _id: { $in: blockedObjectIds.map(objectIdFromValue) } });
  if (blockedPublicIds.length) filters.push({ id: { $in: blockedPublicIds } });

  const users = await db.collection("users").find({ $or: filters }).toArray();
  return users.map((blockedUser) => {
    const record = blockedRecords.find((item) => String(item.userId) === String(blockedUser.id));
    return {
      ...sanitizeUser(blockedUser),
      blockedAt: record?.blockedAt || Date.now(),
    };
  });
}

async function blockUser(user, blockedUserId) {
  const targetId = cleanText(blockedUserId, 80);
  if (!targetId) throw createHttpError(400, "User to block is required.");
  if (targetId === user.id) throw createHttpError(400, "You cannot block yourself.");

  const target = await db.collection("users").findOne({
    $or: [
      { id: targetId },
      ...(isMongoObjectId(targetId) ? [{ _id: objectIdFromValue(targetId) }] : []),
    ],
  });
  if (!target) throw createHttpError(404, "User not found.");

  await db.collection("users").updateOne(
    { id: user.id },
    {
      $pull: {
        blockedUserRecords: { userId: target.id },
      },
    }
  );

  await db.collection("users").updateOne(
    { id: user.id },
    {
      $addToSet: {
        blockedUsers: objectIdFromValue(target._id || target.id),
      },
      $push: {
        blockedUserRecords: {
          userId: target.id,
          blockedAt: new Date(),
        },
      },
    }
  );

  return sanitizeUser(target);
}

async function unblockUser(user, blockedUserId) {
  const targetId = cleanText(blockedUserId, 80);
  if (!targetId) throw createHttpError(400, "User to unblock is required.");

  const target = await db.collection("users").findOne({
    $or: [
      { id: targetId },
      ...(isMongoObjectId(targetId) ? [{ _id: objectIdFromValue(targetId) }] : []),
    ],
  });

  await db.collection("users").updateOne(
    { id: user.id },
    {
      $pull: {
        blockedUsers: target ? objectIdFromValue(target._id || target.id) : objectIdFromValue(targetId),
        blockedUserRecords: { userId: target?.id || targetId },
      },
    }
  );

  return target ? sanitizeUser(target) : { id: targetId };
}

async function deleteUserAccount(userId) {
  const user = await db.collection("users").findOne({ id: userId });

  if (!user) throw createHttpError(404, "User not found.");
  clearTokenCacheForUser(userId);

  await db.collection("deletedUsers").insertOne({
    id: createId("deleted"),
    userId: user.id,
    username: user.username,
    email: user.email,
    contactNumber: user.contactNumber,
    fullName: user.fullName,
    deletedAt: Date.now(),
  });

  const userMessages = await db.collection("messages").find({ authorId: userId }).toArray();
  const removedMessageIds = userMessages.map((message) => message.id);

  await db.collection("users").deleteOne({ id: userId });
  await db.collection("sessions").deleteMany({ userId });
  await db.collection("messages").deleteMany({ authorId: userId });
  await db.collection("reports").deleteMany({
    $or: [
      { reporterPublicId: userId },
      { reportedUserPublicId: userId },
      { messagePublicId: { $in: removedMessageIds } },
    ],
  });

  typingUsers.delete(userId);
}

async function updateUserStatus(userId, status, reason, admin) {
  const nextStatus = status === "suspended" ? "suspended" : "active";
  const user = await db.collection("users").findOne({ id: userId });

  if (!user) throw createHttpError(404, "User not found.");

  const updates = {
    status: nextStatus,
    suspensionReason: nextStatus === "suspended" ? cleanText(reason || "Moderation action", 160) : "",
    updatedAt: Date.now(),
  };

  await db.collection("users").updateOne({ id: userId }, { $set: updates });

  if (nextStatus === "suspended") {
    await db.collection("sessions").deleteMany({ userId });
    clearTokenCacheForUser(userId);
  }

  await writeAdminAudit(admin, nextStatus === "suspended" ? "user:suspend" : "user:reactivate", {
    userId,
    username: user.username,
    reason: updates.suspensionReason,
  });

  return await db.collection("users").findOne({ id: userId });
}

async function requireUser(token) {
  const rawToken = String(token || "").trim();
  if (!rawToken) throw createHttpError(401, "Login required. Please log in again.");

  const cached = tokenCache.get(rawToken);
  if (cached && Date.now() < cached.exp) {
    return cached.user;
  }
  if (cached) tokenCache.delete(rawToken);

  const tokenHash = hashToken(rawToken);

  const session = await db.collection("sessions").findOne({
    tokenHash,
    expiresAt: { $gt: Date.now() },
  });

  let userId = session?.userId || "";
  if (!userId) {
    userId = userIdFromJwt(rawToken);
  }

  if (!userId) throw createHttpError(401, "Session expired. Please log in again.");

  const userFilters = [{ id: userId }];
  if (isMongoObjectId(userId)) userFilters.push({ _id: objectIdFromValue(userId) });
  const user = await db.collection("users").findOne({ $or: userFilters });

  if (!user) throw createHttpError(401, "User not found. Please log in again.");

  const now = Date.now();
  await db.collection("users").updateOne({ id: user.id }, { $set: { lastSeen: now } });
  if (session?.id) {
    await db.collection("sessions").updateOne({ id: session.id }, { $set: { lastSeen: now } });
  }

  const hydratedUser = { ...user, lastSeen: now };
  tokenCache.set(rawToken, {
    user: hydratedUser,
    exp: now + 60000,
  });

  return hydratedUser;
}

function userIdFromJwt(token) {
  if (!JWT_SECRET || !String(token || "").includes(".")) return "";

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return String(decoded.id || decoded.userId || decoded.sub || "");
  } catch (error) {
    throw createHttpError(401, "Invalid or expired token. Please log in again.");
  }
}

async function requireAdmin(token) {
  const rawToken = String(token || "").trim();
  const cached = adminTokenCache.get(rawToken);
  if (cached && Date.now() < cached.exp) {
    return cached.user;
  }
  if (cached) adminTokenCache.delete(rawToken);

  const tokenHash = hashToken(rawToken);

  const session = await db.collection("adminSessions").findOne({
    tokenHash,
    expiresAt: { $gt: Date.now() },
  });

  if (!session) throw createHttpError(403, "Admin login required.");

  await db.collection("adminSessions").updateOne(
    { id: session.id },
    { $set: { lastSeen: Date.now() } }
  );

  const admin = adminUser();
  adminTokenCache.set(rawToken, {
    user: admin,
    exp: Date.now() + 60000,
  });

  return admin;
}

function ensureActiveUser(user) {
  if (user.status === "deleted") {
    throw createHttpError(403, "This account has been removed by the site admin.");
  }

  if (user.status === "suspended") {
    throw createHttpError(403, `This account is suspended${user.suspensionReason ? `: ${user.suspensionReason}` : "."}`);
  }
}

async function createSession(userId, type) {
  const token = crypto.randomBytes(32).toString("hex");

  const session = {
    id: createId("session"),
    userId,
    tokenHash: hashToken(token),
    createdAt: Date.now(),
    lastSeen: Date.now(),
    expiresAt: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  };

  if (type === "admin") {
    await db.collection("adminSessions").insertOne(session);
  } else {
    await db.collection("sessions").insertOne(session);
  }

  return token;
}

async function createPublicState(user = null) {
  try {
    const rooms = await getCachedRooms();
    const messages = await recentVisibleMessages({}, 25);
    const announcements = await db.collection("announcements").find({ status: "published" }).sort({ createdAt: -1 }).limit(30).toArray();
    const usersCount = await db.collection("users").countDocuments();
    const openReports = await db.collection("reports").countDocuments({ status: "open" });
    const hiddenMessages = await db.collection("messages").countDocuments({ hidden: true });
    const activeUserIds = activeSocketUserIds();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const messagesToday = await db.collection("messages").countDocuments({
      createdAt: { $gte: today },
    });
    const accessSet = verifiedRoomIdsForUser(user);
    const filteredMessages = await filterMessagesForUser(messages, rooms, user);
    const presenceIds = [
      ...filteredMessages.map((message) => message.authorId),
      user?.id,
    ];

    return {
      rooms: rooms.map((room) => {
        const roomMessages = messages.filter((message) => message.roomId === room.id);
        const onlineMembers = roomOnlineUserCount(room.id);

        return {
          ...serializeRoom(room, user, accessSet),
          messageCount: roomMessages.length,
          activeMembers: onlineMembers,
          onlineMembers,
        };
      }),
      messages: filteredMessages.map(serializeMessage),
      announcements: announcements.map(removeMongoId),
      reports: [],
      typing: activeTyping(),
      presence: await buildPresenceMap(presenceIds),
      stats: {
        online: activeUserIds.size,
        users: usersCount,
        openReports,
        hiddenMessages,
        activeRooms: rooms.filter((room) => !room.hidden && room.status !== "archived" && room.status !== "deleted").length,
        messagesToday,
        activeCalls: callSessions.size,
      },
    };
  } catch (error) {
    console.warn("State error:", error.message);
    let fallbackRooms = [];

    try {
      fallbackRooms = await getCachedRooms();
    } catch (fallbackError) {
      console.warn("State fallback error:", fallbackError.message);
    }

    return {
      rooms: fallbackRooms.map((room) => serializeRoom(room, user, verifiedRoomIdsForUser(user))),
      messages: [],
      announcements: [],
      reports: [],
      typing: [],
      stats: {
        online: activeSocketUserIds().size,
        users: 0,
        openReports: 0,
        hiddenMessages: 0,
        activeRooms: fallbackRooms.length,
        messagesToday: 0,
        activeCalls: callSessions.size,
      },
    };
  }
}

async function createAdminState() {
  const users = await db.collection("users").find().sort({ createdAt: -1 }).toArray();
  const reports = await db.collection("reports").find().sort({ createdAt: -1 }).toArray();
  const messages = await db.collection("messages").find().toArray();
  const deletedUsers = await db.collection("deletedUsers").find().sort({ deletedAt: -1 }).toArray();
  const auditLogs = await db.collection("adminAuditLogs").find().sort({ createdAt: -1 }).limit(80).toArray();
  const announcements = await db.collection("announcements").find().sort({ createdAt: -1 }).limit(80).toArray();

  const hydratedReports = reports.map((report) => {
    const message = messages.find((item) => item.id === report.messagePublicId || item._id === report.messageId);
    const reporter = users.find((item) => item.id === report.reporterPublicId || item._id === report.reporterId);

    return removeMongoId({
      ...report,
      messageId: report.messagePublicId || report.messageId,
      reporterId: report.reporterPublicId || report.reporterId,
      reportedUserId: report.reportedUserPublicId || report.reportedUserId,
      reason: report.reasonText || report.reason,
      message: message ? removeMongoId(message) : null,
      reporterName: reporter ? reporter.anonymousName : report.reporterName || "Campus member",
    });
  });

  return {
    users: users.map((user) => sanitizeAdminUser(removeMongoId(user))),
    reports: hydratedReports,
    messages: messages.map(serializeMessage),
    deletedUsers: deletedUsers.map(removeMongoId),
    auditLogs: auditLogs.map(removeMongoId),
    announcements: announcements.map(removeMongoId),
    stats: await createAdminStats(),
  };
}

async function createAdminStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalUsers, activeUsers, activeRooms, messagesToday, reportsPending, callsToday, totalCalls] = await Promise.all([
    db.collection("users").countDocuments({
      role: { $ne: "admin" },
      status: { $ne: "deleted" },
    }),
    db.collection("users").countDocuments({
      role: { $ne: "admin" },
      status: { $ne: "deleted" },
    }),
    db.collection("rooms").countDocuments({
      hidden: { $ne: true },
      status: { $ne: "deleted" },
    }),
    db.collection("messages").countDocuments({
      createdAt: { $gte: today },
    }),
    db.collection("reports").countDocuments({ status: "open" }),
    db.collection("calls").countDocuments({
      createdAt: { $gte: today.getTime() },
    }),
    db.collection("calls").countDocuments({}),
  ]);

  return {
    totalUsers,
    activeUsers,
    activeRooms,
    messagesToday,
    reportsPending,
    callsToday,
    totalCalls,
    activeCalls: callSessions.size,
  };
}

function isToday(timestamp) {
  const date = new Date(Number(timestamp || 0));
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}

async function listAnnouncements() {
  const announcements = await db.collection("announcements").find().sort({ createdAt: -1 }).limit(80).toArray();
  return announcements.map(removeMongoId);
}

async function createAnnouncement(input, admin) {
  const title = cleanText(input.title, 80);
  const body = cleanText(input.body, 500);
  const priority = ["low", "normal", "high", "critical"].includes(input.priority) ? input.priority : "normal";
  const target = normalizeAnnouncementTarget(input.target);
  const status = ["draft", "published", "scheduled", "archived"].includes(input.status) ? input.status : "published";
  const scheduledAt = input.scheduledAt ? new Date(input.scheduledAt) : null;

  if (title.length < 3) throw createHttpError(400, "Announcement title must be at least 3 characters.");
  if (body.length < 10) throw createHttpError(400, "Announcement body must be at least 10 characters.");

  const announcement = {
    id: createId("ann"),
    title,
    body,
    priority,
    target,
    targetRoomId: cleanText(input.targetRoomId || "", 80) || null,
    status,
    scheduledAt,
    publishedAt: status === "published" ? Date.now() : null,
    createdBy: objectIdFromValue(admin.id),
    createdByPublicId: admin.id,
    createdByName: admin.name,
    createdAt: Date.now(),
  };

  await db.collection("announcements").insertOne(announcement);
  return removeMongoId(announcement);
}

async function updateAnnouncement(announcementId, input, admin) {
  const current = await db.collection("announcements").findOne({ id: announcementId });
  if (!current) throw createHttpError(404, "Announcement not found.");

  const title = cleanText(input.title ?? current.title, 80);
  const body = cleanText(input.body ?? current.body, 500);
  const priority = ["low", "normal", "high", "critical"].includes(input.priority) ? input.priority : current.priority || "normal";
  const target = input.target ? normalizeAnnouncementTarget(input.target) : current.target || "all";
  const status = ["draft", "published", "scheduled", "archived"].includes(input.status) ? input.status : current.status || "published";
  const scheduledAt = input.scheduledAt ? new Date(input.scheduledAt) : current.scheduledAt || null;

  if (title.length < 3) throw createHttpError(400, "Announcement title must be at least 3 characters.");
  if (body.length < 10) throw createHttpError(400, "Announcement body must be at least 10 characters.");

  const updates = {
    title,
    body,
    priority,
    target,
    targetRoomId: cleanText(input.targetRoomId ?? current.targetRoomId ?? "", 80) || null,
    status,
    scheduledAt,
    publishedAt: status === "published" ? current.publishedAt || Date.now() : current.publishedAt || null,
    updatedBy: objectIdFromValue(admin.id),
    updatedByPublicId: admin.id,
    updatedByName: admin.name,
    updatedAt: Date.now(),
  };

  await db.collection("announcements").updateOne({ id: announcementId }, { $set: updates });
  return removeMongoId(await db.collection("announcements").findOne({ id: announcementId }));
}

async function deleteAnnouncement(announcementId) {
  const announcement = await db.collection("announcements").findOne({ id: announcementId });
  if (!announcement) throw createHttpError(404, "Announcement not found.");

  await db.collection("announcements").deleteOne({ id: announcementId });
  return removeMongoId(announcement);
}

async function getPlatformSettings() {
  const stored = await db.collection("platformSettings").findOne({ id: "platform" });
  return {
    ...DEFAULT_PLATFORM_SETTINGS,
    ...(stored?.settings || {}),
  };
}

async function savePlatformSettings(input, admin) {
  const settings = {
    maintenanceMode: Boolean(input.maintenanceMode),
    registrationOpen: input.registrationOpen !== false,
    maxRoomSize: Math.min(1000, Math.max(10, Number(input.maxRoomSize || DEFAULT_PLATFORM_SETTINGS.maxRoomSize))),
    maxMessageLength: Math.min(1000, Math.max(20, Number(input.maxMessageLength || DEFAULT_PLATFORM_SETTINGS.maxMessageLength))),
    rateLimitPerMinute: Math.min(120, Math.max(5, Number(input.rateLimitPerMinute || DEFAULT_PLATFORM_SETTINGS.rateLimitPerMinute))),
    profanityFilter: input.profanityFilter !== false,
    guestModeAllowed: input.guestModeAllowed !== false,
    autoDeleteMessages: input.autoDeleteMessages !== false,
    emailNotifications: Boolean(input.emailNotifications),
  };

  await db.collection("platformSettings").updateOne(
    { id: "platform" },
    {
      $set: {
        id: "platform",
        settings,
        updatedBy: admin.id,
        updatedAt: Date.now(),
      },
    },
    { upsert: true }
  );

  return settings;
}

async function listUserRooms(user) {
  const rooms = await db.collection("rooms")
    .find({
      $or: [
        { createdById: user.id },
        { createdBy: objectIdFromValue(user._id || user.id) },
      ],
      status: { $ne: "deleted" },
    })
    .sort({ createdAt: -1 })
    .toArray();

  return rooms.map((room) => serializeRoom(room, user, new Set([room.id])));
}

async function createUserRoom(input, user) {
  const name = cleanText(input.name, 50);
  const description = cleanText(input.description || input.desc, 200);
  const icon = cleanText(input.icon || "💬", 8);
  const color = /^#[0-9a-f]{6}$/i.test(input.color || "") ? input.color : "#6c63ff";
  const visibility = input.visibility === "private" ? "private" : "public";
  const maxCapacity = Math.min(250, Math.max(2, Number(input.maxCapacity || input.maxMembers || 50)));
  const password = cleanText(input.password || "", 80);
  const passwordProtected = Boolean(password);

  if (name.length < 3) throw createHttpError(400, "Room name must be at least 3 characters.");
  if (passwordProtected && password.length < 4) throw createHttpError(400, "Room password must be at least 4 characters.");

  const baseId = slugifyRoom(name);
  let id = baseId;
  let suffix = 2;
  while (await db.collection("rooms").findOne({ id })) {
    id = `${baseId}-${suffix}`;
    suffix += 1;
  }

  const passwordSecret = password ? hashPassword(password) : { salt: "", hash: "" };
  const passwordHash = passwordSecret.hash;
  const passwordSalt = passwordSecret.salt;
  const now = Date.now();
  const room = normalizeRoomForStorage({
    id,
    slug: id,
    name,
    description,
    desc: description,
    category: visibility === "private" ? "Private Room" : "Public Room",
    icon,
    color,
    visibility,
    maxCapacity,
    passwordProtected,
    isPasswordProtected: passwordProtected,
    passwordSalt,
    passwordHash,
    password: null,
    hidden: false,
    createdBy: objectIdFromValue(user._id || user.id),
    createdById: user.id,
    isSeeded: false,
    createdAt: now,
    updatedAt: now,
  });

  await db.collection("rooms").insertOne(room);
  invalidateRoomsCache();
  return removeMongoId(room);
}

async function updateUserRoom(roomId, input, user) {
  const room = await findOwnedRoom(roomId, user);
  const nextStatus = String(input.status || "").toLowerCase();
  const updates = {
    name: cleanText(input.name || room.name, 50),
    description: cleanText(input.description || input.desc || room.description || room.desc || "", 200),
    updatedAt: Date.now(),
  };
  updates.desc = updates.description;

  if (["active", "archived"].includes(nextStatus)) {
    updates.status = nextStatus;
    updates.hidden = nextStatus === "archived";
  }

  if (updates.name.length < 3) throw createHttpError(400, "Room name must be at least 3 characters.");

  await db.collection("rooms").updateOne({ id: room.id }, { $set: updates });
  invalidateRoomsCache();
  return removeMongoId(await db.collection("rooms").findOne({ id: room.id }));
}

async function deleteUserRoom(roomId, user) {
  const room = await findOwnedRoom(roomId, user);
  if (room.isSeeded) throw createHttpError(400, "Default rooms cannot be deleted.");

  await db.collection("rooms").deleteOne({ id: room.id });
  await db.collection("messages").deleteMany({ roomId: room.id });
  forgetVerifiedRoom(room.id);
  invalidateRoomsCache();
}

async function findOwnedRoom(roomId, user) {
  const room = await db.collection("rooms").findOne({
    $or: [{ id: roomId }, { slug: roomId }],
  });
  if (!room) throw createHttpError(404, "Room not found.");
  const ownedByUser =
    String(room.createdById || "") === String(user.id) ||
    String(room.createdBy || "") === String(user._id || "");
  if (!ownedByUser) throw createHttpError(403, "You can manage only rooms you created.");
  return room;
}

async function createAdminRoom(input, admin) {
  const name = cleanText(input.name, 50);
  const desc = cleanText(input.desc || input.description, 200);
  const category = cleanText(input.category || "Public", 40);
  const icon = cleanText(input.icon || initialsForRoom(name), 4).toUpperCase();
  const color = /^#[0-9a-f]{6}$/i.test(input.color || "") ? input.color : "#6C63FF";
  const visibility = input.visibility === "private" ? "private" : "public";
  const maxCapacity = Math.min(1000, Math.max(2, Number(input.maxCapacity || input.maxRoomSize || DEFAULT_PLATFORM_SETTINGS.maxRoomSize)));
  const passwordProtected = Boolean(input.passwordProtected);
  const password = passwordProtected ? cleanText(input.password || "", 80) : "";

  if (name.length < 3) throw createHttpError(400, "Room name must be at least 3 characters.");
  if (passwordProtected && password.length < 4) throw createHttpError(400, "Room password must be at least 4 characters.");

  const id = slugifyRoom(name);
  const existing = await db.collection("rooms").findOne({ id });
  if (existing) throw createHttpError(409, "A room with this name already exists.");
  const passwordSecret = password ? hashPassword(password) : { salt: "", hash: "" };
  const passwordHash = passwordSecret.hash;
  const passwordSalt = passwordSecret.salt;

  const room = normalizeRoomForStorage({
    id,
    name,
    desc,
    category,
    icon,
    color,
    visibility,
    maxCapacity,
    passwordProtected,
    isPasswordProtected: passwordProtected,
    passwordSalt,
    passwordHash,
    password: null,
    hidden: false,
    createdBy: isMongoObjectId(admin.id) ? admin.id : null,
    createdById: admin.id,
    createdAt: Date.now(),
  });

  await db.collection("rooms").insertOne(room);
  invalidateRoomsCache();
  await writeAdminAudit(admin, "room:create", { roomId: room.id, name: room.name });
  return removeMongoId(room);
}

function roomRequiresPassword(room = {}) {
  return Boolean(room.isPasswordProtected || room.passwordProtected || room.password || room.passwordHash);
}

function userOwnsRoom(room = {}, user = {}) {
  return Boolean(
    user?.role === "admin" ||
    String(room.createdById || "") === String(user?.id || "") ||
    String(room.createdBy || "") === String(user?._id || user?.id || "")
  );
}

async function findRoomWithSecrets(roomId) {
  const value = String(roomId || "");
  const filters = [{ id: value }, { slug: value }];
  if (isMongoObjectId(value)) filters.push({ _id: objectIdFromValue(value) });

  const room = await models.Room.findOne({ $or: filters })
    .select("+password +passwordSalt +passwordHash")
    .lean({ virtuals: false });

  return normalizeDocument(room);
}

function verifiedRoomIdsForUser(user) {
  const userId = String(user?.id || "");
  if (!userId) return new Set();
  return new Set(verifiedRoomsByUser.get(userId) || []);
}

function rememberVerifiedRoom(room, user) {
  const userId = String(user?.id || "");
  if (!userId || !room?.id) return;

  const ids = verifiedRoomsByUser.get(userId) || new Set();
  ids.add(String(room.id));
  if (room.slug) ids.add(String(room.slug));
  verifiedRoomsByUser.set(userId, ids);
}

function forgetVerifiedRoom(roomId) {
  const id = String(roomId || "");
  if (!id) return;
  verifiedRoomsByUser.forEach((ids) => ids.delete(id));
}

function userCanAccessRoom(room, user, accessSet = new Set()) {
  if (!roomRequiresPassword(room)) return true;
  if (userOwnsRoom(room, user)) return true;
  return accessSet.has(String(room.id)) || accessSet.has(String(room.slug));
}

async function requireRoomEntry(room, user) {
  if (!roomRequiresPassword(room)) return true;
  if (userOwnsRoom(room, user)) return true;
  if (userCanAccessRoom(room, user, verifiedRoomIdsForUser(user))) return true;
  throw createHttpError(403, "Room password required.");
}

function verifyRoomPasswordValue(room, password) {
  const value = cleanText(password || "", 80);
  if (!roomRequiresPassword(room)) return true;
  if (!value) return false;
  if (room.passwordSalt && /^[a-f0-9]{128}$/i.test(String(room.passwordHash || ""))) {
    return verifyPassword(value, room.passwordSalt, room.passwordHash);
  }
  if (room.password && !/^[a-f0-9]{128}$/i.test(String(room.password))) return String(room.password) === value;
  return false;
}

async function verifyRoomPassword(roomId, user, password) {
  const room = await findRoomWithSecrets(roomId);
  if (!room) throw createHttpError(404, "Room not found.");
  if (userOwnsRoom(room, user) || !roomRequiresPassword(room)) {
    return { room, messages: await roomMessagesForUser(room, user) };
  }
  if (!verifyRoomPasswordValue(room, password)) {
    throw createHttpError(401, "Incorrect password");
  }
  rememberVerifiedRoom(room, user);
  return { room, messages: await roomMessagesForUser(room, user) };
}

async function joinRoomWithPassword(roomId, user, password) {
  const room = await findRoomWithSecrets(roomId);
  if (!room) throw createHttpError(404, "Room not found.");
  if (roomRequiresPassword(room) && !userOwnsRoom(room, user)) {
    if (!userCanAccessRoom(room, user, verifiedRoomIdsForUser(user))) {
      return await verifyRoomPassword(room.id, user, password);
    }
  }
  return { room, messages: await roomMessagesForUser(room, user) };
}

async function roomMessagesForUser(room, user) {
  await requireRoomEntry(room, user);
  const messages = await recentVisibleMessages({ roomId: room.id }, 25);
  const blockedIds = await blockedAuthorIds(user);
  return messages.filter((message) => !blockedIds.has(String(message.authorId || "")));
}

async function filterMessagesForUser(messages, rooms, user) {
  const accessSet = verifiedRoomIdsForUser(user);
  const roomMap = new Map(rooms.map((room) => [room.id, room]));
  const blockedIds = await blockedAuthorIds(user);
  return messages.filter((message) => {
    if (blockedIds.has(String(message.authorId || ""))) return false;
    const room = roomMap.get(message.roomId);
    if (!room) return true;
    return userCanAccessRoom(room, user, accessSet);
  });
}

async function blockedAuthorIds(user) {
  if (!user?.id) return new Set();
  const directIds = (user.blockedUserRecords || [])
    .map((record) => String(record.userId || ""))
    .filter(Boolean);
  const hydrated = await listBlockedUsers(user);
  return new Set([...directIds, ...hydrated.map((blockedUser) => String(blockedUser.id || ""))]);
}

function normalizeSocialUserId(value) {
  return cleanText(value, 80);
}

function socialPairKey(firstUserId, secondUserId) {
  const first = normalizeSocialUserId(firstUserId);
  const second = normalizeSocialUserId(secondUserId);
  if (!first || !second) throw createHttpError(400, "Two users are required.");
  if (first === second) throw createHttpError(400, "You cannot connect with yourself.");
  return [first, second].sort().join(":");
}

function socialPairUserIds(firstUserId, secondUserId) {
  return socialPairKey(firstUserId, secondUserId).split(":");
}

async function findActiveUserById(userId) {
  const id = normalizeSocialUserId(userId);
  if (!id) throw createHttpError(400, "User is required.");
  const user = await db.collection("users").findOne({ id, status: { $ne: "deleted" }, role: { $nin: ["admin", "guest"] } });
  if (!user) throw createHttpError(404, "User not found.");
  if (user.status === "suspended") throw createHttpError(403, "This user is not available right now.");
  return user;
}

async function findUserByIdAnyStatus(userId) {
  const id = normalizeSocialUserId(userId);
  if (!id) throw createHttpError(400, "User is required.");
  const user = await db.collection("users").findOne({ id });
  if (!user) throw createHttpError(404, "User not found.");
  return user;
}

async function usersHaveBlockedEachOther(firstUser, secondUser) {
  const [firstBlocked, secondBlocked] = await Promise.all([
    blockedAuthorIds(firstUser),
    blockedAuthorIds(secondUser),
  ]);

  return firstBlocked.has(String(secondUser.id || "")) || secondBlocked.has(String(firstUser.id || ""));
}

async function assertCanCreateSocialConnection(currentUser, targetUser) {
  if (!currentUser?.id) throw createHttpError(401, "Please log in again.");
  if (!targetUser?.id) throw createHttpError(404, "User not found.");
  if (String(currentUser.id) === String(targetUser.id)) throw createHttpError(400, "You cannot send a request to yourself.");
  if (["admin", "guest"].includes(currentUser.role) || ["admin", "guest"].includes(targetUser.role)) {
    throw createHttpError(403, "Only registered users can use personal chat.");
  }
  if (currentUser.status === "suspended" || targetUser.status === "suspended") throw createHttpError(403, "This account is not available.");
  if (await usersHaveBlockedEachOther(currentUser, targetUser)) throw createHttpError(403, "You cannot connect with this user.");
}

async function existingFriendshipForUsers(firstUserId, secondUserId) {
  return db.collection("friendships").findOne({
    pairKey: socialPairKey(firstUserId, secondUserId),
    status: "active",
  });
}

async function pendingFriendRequestForUsers(firstUserId, secondUserId) {
  return db.collection("friendRequests").findOne({
    pairKey: socialPairKey(firstUserId, secondUserId),
    status: "pending",
  });
}

async function assertCanCreateDmThread(currentUser, targetUser) {
  await assertCanCreateSocialConnection(currentUser, targetUser);
  const friendship = await existingFriendshipForUsers(currentUser.id, targetUser.id);
  if (!friendship) throw createHttpError(403, "You can message only accepted friends.");
  return friendship;
}

function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function timestampValue(value) {
  if (!value) return 0;
  if (typeof value === "number") return value;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function socialObjectIdForUser(user) {
  return user?._id && isMongoObjectId(user._id) ? objectIdFromValue(user._id) : null;
}

function displayNameForUser(user = {}) {
  return cleanText(user.fullName || user.anonymousName || user.username || "Anonymous User", 80);
}

function publicUserCard(user = {}, relationship = {}) {
  const status = relationship.status || "can_request";
  const canSeePhoto = status === "friends" || (user.privacySettings || {}).profilePhoto !== "nobody";

  return {
    id: String(user.id || ""),
    username: user.username || "",
    fullName: user.fullName || "",
    name: displayNameForUser(user),
    anonymousName: user.anonymousName || "",
    about: user.about || "",
    customStatus: user.customStatus || "",
    avatarColor: user.avatarColor || "#6c63ff",
    avatarDataUrl: canSeePhoto ? user.avatarDataUrl || "" : "",
    online: socketUserIds(user.id).length > 0,
    lastSeen: timestampValue(user.lastSeen),
    relationship: {
      status,
      requestId: relationship.requestId || "",
      friendshipId: relationship.friendshipId || "",
      canSendRequest: status === "can_request",
      canRespond: status === "incoming_request",
      canMessage: status === "friends",
    },
  };
}

async function usersByPublicId(userIds = [], options = {}) {
  const ids = [...new Set(userIds.map((id) => String(id || "")).filter(Boolean))];
  if (!ids.length) return new Map();

  const filter = { id: { $in: ids } };
  if (options.activeOnly !== false) {
    filter.status = "active";
    filter.role = { $nin: ["admin", "guest"] };
  }

  const users = await db.collection("users").find(filter).toArray();
  return new Map(users.map((user) => [String(user.id), user]));
}

function friendshipRelationship(friendship = null) {
  return friendship ? { status: "friends", friendshipId: friendship.id || "" } : null;
}

function requestRelationship(request = null, viewerId = "") {
  if (!request) return null;
  const direction = String(request.fromUserId || "") === String(viewerId || "") ? "request_sent" : "incoming_request";
  return { status: direction, requestId: request.id || "" };
}

async function relationshipMapsForUsers(viewerId, targetUserIds = []) {
  const pairKeys = [...new Set(targetUserIds.map((targetId) => socialPairKey(viewerId, targetId)))];
  if (!pairKeys.length) {
    return {
      friendshipsByPairKey: new Map(),
      requestsByPairKey: new Map(),
    };
  }

  const [friendships, requests] = await Promise.all([
    db.collection("friendships").find({ pairKey: { $in: pairKeys }, status: "active" }).toArray(),
    db.collection("friendRequests").find({ pairKey: { $in: pairKeys }, status: "pending" }).toArray(),
  ]);

  return {
    friendshipsByPairKey: new Map(friendships.map((friendship) => [String(friendship.pairKey), friendship])),
    requestsByPairKey: new Map(requests.map((request) => [String(request.pairKey), request])),
  };
}

function relationshipForUser(viewerId, targetId, maps) {
  const pairKey = socialPairKey(viewerId, targetId);
  return (
    friendshipRelationship(maps.friendshipsByPairKey.get(pairKey)) ||
    requestRelationship(maps.requestsByPairKey.get(pairKey), viewerId) ||
    { status: "can_request" }
  );
}

function serializeFriendRequest(request = {}, viewerId = "", otherUser = null) {
  const direction = String(request.fromUserId || "") === String(viewerId || "") ? "sent" : "incoming";
  const relationship = requestRelationship(request, viewerId);

  return {
    id: String(request.id || request._id || ""),
    fromUserId: String(request.fromUserId || ""),
    toUserId: String(request.toUserId || ""),
    pairKey: request.pairKey || socialPairKey(request.fromUserId, request.toUserId),
    status: request.status || "pending",
    direction,
    createdAt: timestampValue(request.createdAt),
    updatedAt: timestampValue(request.updatedAt),
    respondedAt: timestampValue(request.respondedAt),
    respondedByUserId: request.respondedByUserId || "",
    user: otherUser ? publicUserCard(otherUser, relationship) : null,
  };
}

function emitFriendRealtime(userId, event, payload) {
  emitToUser(userId, event, payload);
  emitToUser(userId, "friends:update", {
    type: event,
    ...payload,
  });
}

function friendNotification(type, actorUser, request) {
  const actorName = displayNameForUser(actorUser);
  const messages = {
    request: `${actorName} sent you a friend request.`,
    accepted: `${actorName} accepted your friend request.`,
    declined: `${actorName} declined your friend request.`,
    cancelled: `${actorName} cancelled the friend request.`,
  };

  return {
    id: createId("notif"),
    type: `friend-${type}`,
    title: "Friend request",
    message: messages[type] || "Friend request updated.",
    fromUserId: actorUser.id || "",
    requestId: request.id || "",
    createdAt: Date.now(),
  };
}

async function searchUsersForFriendRequest(viewer, query) {
  const text = cleanText(query, 60);
  if (text.length < 2) return [];

  const currentBlockedIds = await blockedAuthorIds(viewer);
  const searchRegex = new RegExp(escapeRegExp(text), "i");
  const candidates = await db.collection("users").find({
    id: { $nin: [String(viewer.id), ...currentBlockedIds] },
    role: { $nin: ["admin", "guest"] },
    status: "active",
    $or: [
      { username: searchRegex },
      { fullName: searchRegex },
      { anonymousName: searchRegex },
    ],
  }).limit(20).toArray();

  const visibleUsers = candidates.filter((candidate) => {
    const blockedRecords = Array.isArray(candidate.blockedUserRecords) ? candidate.blockedUserRecords : [];
    return !blockedRecords.some((record) => String(record.userId || "") === String(viewer.id));
  });
  const maps = await relationshipMapsForUsers(viewer.id, visibleUsers.map((candidate) => candidate.id));

  return visibleUsers.map((candidate) => publicUserCard(
    candidate,
    relationshipForUser(viewer.id, candidate.id, maps)
  ));
}

async function listFriendsForUser(user) {
  const friendships = await db.collection("friendships")
    .find({ userIds: user.id, status: "active" })
    .sort({ updatedAt: -1 })
    .toArray();
  const friendIds = friendships.map((friendship) => (
    (friendship.userIds || []).map(String).find((friendId) => friendId !== String(user.id))
  )).filter(Boolean);
  const users = await usersByPublicId(friendIds);

  return friendships
    .map((friendship) => {
      const friendId = (friendship.userIds || []).map(String).find((id) => id !== String(user.id));
      const friendUser = users.get(String(friendId));
      if (!friendUser) return null;
      return {
        friendshipId: friendship.id || "",
        since: timestampValue(friendship.createdAt),
        lastInteractionAt: timestampValue(friendship.lastInteractionAt || friendship.updatedAt),
        user: publicUserCard(friendUser, { status: "friends", friendshipId: friendship.id || "" }),
      };
    })
    .filter(Boolean);
}

async function listFriendRequestsForUser(user) {
  const [incomingRequests, sentRequests] = await Promise.all([
    db.collection("friendRequests").find({ toUserId: user.id, status: "pending" }).sort({ createdAt: -1 }).toArray(),
    db.collection("friendRequests").find({ fromUserId: user.id, status: "pending" }).sort({ createdAt: -1 }).toArray(),
  ]);
  const users = await usersByPublicId([
    ...incomingRequests.map((request) => request.fromUserId),
    ...sentRequests.map((request) => request.toUserId),
  ]);

  return {
    incoming: incomingRequests
      .map((request) => serializeFriendRequest(request, user.id, users.get(String(request.fromUserId))))
      .filter((request) => request.user),
    sent: sentRequests
      .map((request) => serializeFriendRequest(request, user.id, users.get(String(request.toUserId))))
      .filter((request) => request.user),
  };
}

async function createFriendRequest(user, targetUserId) {
  const target = await findActiveUserById(targetUserId);
  await assertCanCreateSocialConnection(user, target);

  const friendship = await existingFriendshipForUsers(user.id, target.id);
  if (friendship) {
    return {
      created: false,
      alreadyFriends: true,
      friend: publicUserCard(target, { status: "friends", friendshipId: friendship.id || "" }),
    };
  }

  const pendingRequest = await pendingFriendRequestForUsers(user.id, target.id);
  if (pendingRequest) {
    return {
      created: false,
      alreadyPending: true,
      request: serializeFriendRequest(pendingRequest, user.id, String(pendingRequest.fromUserId) === String(user.id) ? target : target),
    };
  }

  const request = {
    id: createId("fr"),
    fromUserId: user.id,
    toUserId: target.id,
    fromUserObjectId: socialObjectIdForUser(user),
    toUserObjectId: socialObjectIdForUser(target),
    pairKey: socialPairKey(user.id, target.id),
    status: "pending",
    respondedAt: null,
    respondedByUserId: "",
  };

  await db.collection("friendRequests").insertOne(request);
  const storedRequest = await db.collection("friendRequests").findOne({ id: request.id });
  const outgoingRequest = serializeFriendRequest(storedRequest, user.id, target);
  const incomingRequest = serializeFriendRequest(storedRequest, target.id, user);

  emitFriendRealtime(target.id, "friend:request:new", {
    request: incomingRequest,
    fromUser: publicUserCard(user, { status: "incoming_request", requestId: storedRequest.id }),
    notification: friendNotification("request", user, storedRequest),
  });

  return {
    created: true,
    request: outgoingRequest,
  };
}

async function respondToFriendRequest(user, requestId, action) {
  const id = cleanText(requestId, 80);
  const normalizedAction = String(action || "").trim().toLowerCase();
  const accepted = ["accept", "accepted"].includes(normalizedAction);
  const declined = ["decline", "declined", "reject", "rejected"].includes(normalizedAction);
  if (!accepted && !declined) throw createHttpError(400, "Choose accept or decline.");

  const request = await db.collection("friendRequests").findOne({ id, status: "pending" });
  if (!request) throw createHttpError(404, "Friend request not found.");
  if (String(request.toUserId) !== String(user.id)) throw createHttpError(403, "Only the recipient can respond to this request.");

  const sender = accepted ? await findActiveUserById(request.fromUserId) : await findUserByIdAnyStatus(request.fromUserId);
  const now = new Date();
  const nextStatus = accepted ? "accepted" : "declined";

  if (accepted) {
    await assertCanCreateSocialConnection(user, sender);
  }

  await db.collection("friendRequests").updateOne(
    { id: request.id, status: "pending" },
    {
      $set: {
        status: nextStatus,
        respondedAt: now,
        respondedByUserId: user.id,
      },
    }
  );
  const updatedRequest = await db.collection("friendRequests").findOne({ id: request.id });

  if (!accepted) {
    emitFriendRealtime(sender.id, "friend:request:declined", {
      request: serializeFriendRequest(updatedRequest, sender.id, user),
      notification: friendNotification("declined", user, updatedRequest),
    });

    return {
      accepted: false,
      request: serializeFriendRequest(updatedRequest, user.id, sender),
    };
  }

  const pairKey = socialPairKey(user.id, sender.id);
  const existingFriendship = await db.collection("friendships").findOne({ pairKey });
  await db.collection("friendships").updateOne(
    { pairKey },
    {
      $set: {
        userIds: socialPairUserIds(user.id, sender.id),
        pairKey,
        status: "active",
        requestId: request.id,
        createdByUserId: sender.id,
        removedAt: null,
        removedByUserId: "",
        lastInteractionAt: now,
      },
      $setOnInsert: {
        id: existingFriendship?.id || createId("fs"),
      },
    },
    { upsert: true }
  );
  const friendship = await db.collection("friendships").findOne({ pairKey });
  const recipientCard = publicUserCard(user, { status: "friends", friendshipId: friendship.id || "" });
  const senderCard = publicUserCard(sender, { status: "friends", friendshipId: friendship.id || "" });

  emitFriendRealtime(sender.id, "friend:request:accepted", {
    request: serializeFriendRequest(updatedRequest, sender.id, user),
    friend: recipientCard,
    friendshipId: friendship.id || "",
    notification: friendNotification("accepted", user, updatedRequest),
  });
  emitFriendRealtime(user.id, "friend:request:accepted", {
    request: serializeFriendRequest(updatedRequest, user.id, sender),
    friend: senderCard,
    friendshipId: friendship.id || "",
  });

  return {
    accepted: true,
    request: serializeFriendRequest(updatedRequest, user.id, sender),
    friendship: removeMongoId(friendship),
    friend: senderCard,
  };
}

async function cancelFriendRequest(user, requestId) {
  const id = cleanText(requestId, 80);
  const request = await db.collection("friendRequests").findOne({ id, status: "pending" });
  if (!request) throw createHttpError(404, "Friend request not found.");
  if (String(request.fromUserId) !== String(user.id)) throw createHttpError(403, "Only the sender can cancel this request.");

  const recipient = await findUserByIdAnyStatus(request.toUserId);
  await db.collection("friendRequests").updateOne(
    { id: request.id, status: "pending" },
    {
      $set: {
        status: "cancelled",
        respondedAt: new Date(),
        respondedByUserId: user.id,
      },
    }
  );
  const updatedRequest = await db.collection("friendRequests").findOne({ id: request.id });

  emitFriendRealtime(recipient.id, "friend:request:cancelled", {
    request: serializeFriendRequest(updatedRequest, recipient.id, user),
    notification: friendNotification("cancelled", user, updatedRequest),
  });

  return {
    cancelled: true,
    request: serializeFriendRequest(updatedRequest, user.id, recipient),
  };
}

function plainMapValue(value) {
  if (!value) return {};
  if (value instanceof Map) return Object.fromEntries([...value.entries()].map(([key, item]) => [String(key), item]));
  if (typeof value === "object") return { ...value };
  return {};
}

function dmParticipantId(thread = {}, viewerId = "") {
  return (thread.participantIds || [])
    .map(String)
    .find((participantId) => participantId !== String(viewerId || "")) || "";
}

function dmMessagePreview(message = {}) {
  const text = cleanText(message.text || "", 160);
  if (text) return text;
  if (message.attachment?.voiceNote) return "Voice message";
  if (message.attachment?.name) return message.attachment.name;
  if (message.attachment) return "Shared an attachment";
  return "";
}

function serializeDmMessage(message = {}) {
  if (!message || typeof message !== "object") return message;
  const normalized = normalizeDocument({
    ...message,
    reactionSummary: plainMapValue(message.reactionSummary),
    reactionsByUser: plainMapValue(message.reactionsByUser),
  });
  const delivery = normalized.delivery || {};
  const id = String(normalized.id || normalized._id || "");

  return {
    ...normalized,
    id,
    _id: normalized._id ? String(normalized._id) : undefined,
    clientTempId: normalized.clientTempId || "",
    senderId: String(normalized.senderId || ""),
    recipientId: String(normalized.recipientId || ""),
    participantIds: (normalized.participantIds || []).map(String),
    authorId: String(normalized.senderId || ""),
    createdAt: timestampValue(normalized.createdAt),
    updatedAt: timestampValue(normalized.updatedAt),
    delivery: {
      sentAt: timestampValue(delivery.sentAt),
      deliveredTo: Array.isArray(delivery.deliveredTo) ? delivery.deliveredTo.map(String) : [],
      seenBy: Array.isArray(delivery.seenBy) ? delivery.seenBy.map(String) : [],
    },
  };
}

function serializeDmThread(thread = {}, viewerId = "", users = new Map(), lastMessage = null) {
  if (!thread || typeof thread !== "object") return null;
  const unreadByUserId = plainMapValue(thread.unreadByUserId);
  const normalized = normalizeDocument({ ...thread, unreadByUserId });
  const id = String(normalized.id || normalized._id || "");
  const participantIds = (normalized.participantIds || []).map(String);
  const friendId = dmParticipantId(normalized, viewerId);
  const friendUser = users.get(String(friendId));
  const relationship = { status: "friends", friendshipId: normalized.friendshipId || "" };

  return {
    ...normalized,
    id,
    _id: normalized._id ? String(normalized._id) : undefined,
    participantIds,
    participant: friendUser ? publicUserCard(friendUser, relationship) : null,
    unreadCount: Math.max(0, Number(unreadByUserId[String(viewerId)] || 0)),
    lastMessageText: normalized.lastMessageText || (lastMessage ? dmMessagePreview(lastMessage) : ""),
    lastMessageAt: timestampValue(normalized.lastMessageAt || normalized.updatedAt || normalized.createdAt),
    createdAt: timestampValue(normalized.createdAt),
    updatedAt: timestampValue(normalized.updatedAt),
    lastMessage: lastMessage ? serializeDmMessage(lastMessage) : null,
  };
}

async function findDmThreadForUser(threadId, user) {
  const id = cleanText(threadId, 80);
  if (!id) throw createHttpError(400, "DM thread is required.");
  const thread = await db.collection("dmThreads").findOne({
    id,
    participantIds: user.id,
    status: { $ne: "deleted" },
  });
  if (!thread) throw createHttpError(404, "Personal chat not found.");
  return thread;
}

async function dmUsersForThreads(threads = []) {
  const userIds = threads.flatMap((thread) => thread.participantIds || []);
  return usersByPublicId(userIds, { activeOnly: false });
}

async function listDmThreadsForUser(user) {
  const threads = await db.collection("dmThreads")
    .find({
      participantIds: user.id,
      status: { $ne: "deleted" },
      hiddenForUserIds: { $ne: user.id },
    })
    .sort({ lastMessageAt: -1, updatedAt: -1 })
    .limit(80)
    .toArray();
  const users = await dmUsersForThreads(threads);

  return threads
    .map((thread) => serializeDmThread(thread, user.id, users))
    .filter((thread) => thread?.participant)
    .sort((a, b) => Number(b.lastMessageAt || b.updatedAt || 0) - Number(a.lastMessageAt || a.updatedAt || 0));
}

async function getOrCreateDmThread(user, targetUserId) {
  const target = await findActiveUserById(targetUserId);
  const friendship = await assertCanCreateDmThread(user, target);
  const pairKey = socialPairKey(user.id, target.id);
  let thread = await db.collection("dmThreads").findOne({ pairKey });
  let created = false;

  if (!thread) {
    const newThread = {
      id: createId("dmth"),
      participantIds: socialPairUserIds(user.id, target.id),
      pairKey,
      friendshipId: friendship.id || "",
      status: "active",
      lastMessageId: "",
      lastMessageText: "",
      lastMessageAt: null,
      hiddenForUserIds: [],
      unreadByUserId: {
        [String(user.id)]: 0,
        [String(target.id)]: 0,
      },
    };

    await db.collection("dmThreads").insertOne(newThread);
    thread = await db.collection("dmThreads").findOne({ id: newThread.id });
    created = true;
  } else if (thread.status !== "active" || (thread.hiddenForUserIds || []).includes(String(user.id))) {
    await db.collection("dmThreads").updateOne(
      { id: thread.id },
      {
        $set: {
          status: "active",
          friendshipId: friendship.id || thread.friendshipId || "",
        },
        $pull: { hiddenForUserIds: user.id },
      }
    );
    thread = await db.collection("dmThreads").findOne({ id: thread.id });
  }

  const users = await usersByPublicId([user.id, target.id], { activeOnly: false });
  return {
    created,
    thread: serializeDmThread(thread, user.id, users),
  };
}

async function getDmReplyPreview(messageId, threadId) {
  const id = cleanText(messageId, 80);
  if (!id) return null;
  const message = await db.collection("dmMessages").findOne({
    id,
    threadId,
    deletedAt: null,
  });
  if (!message) return null;
  const users = await usersByPublicId([message.senderId], { activeOnly: false });
  const sender = users.get(String(message.senderId));
  return {
    id: message.id,
    author: displayNameForUser(sender) || "Message",
    text: dmMessagePreview(message),
  };
}

async function listDmMessagesForThread(user, threadId, query = {}) {
  const thread = await findDmThreadForUser(threadId, user);
  const limit = Math.max(1, Math.min(Number.parseInt(query.limit || "50", 10) || 50, 100));
  const beforeTime = query.before ? new Date(String(query.before)).getTime() : 0;
  const filters = {
    threadId: thread.id,
    hiddenForUserIds: { $ne: user.id },
  };

  if (Number.isFinite(beforeTime) && beforeTime > 0) {
    filters.createdAt = { $lt: beforeTime };
  }

  const messages = await db.collection("dmMessages")
    .find(filters)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  const users = await dmUsersForThreads([thread]);

  return {
    thread: serializeDmThread(thread, user.id, users),
    threadId: thread.id,
    messages: messages.reverse().map(serializeDmMessage),
  };
}

async function createDmMessage(user, threadId, body = {}) {
  const thread = await findDmThreadForUser(threadId, user);
  const recipientId = dmParticipantId(thread, user.id);
  const recipient = await findActiveUserById(recipientId);
  const friendship = await assertCanCreateDmThread(user, recipient);
  const text = cleanText(body.text, 2000);
  const attachment = normalizeAttachment(body.attachment);
  const replyToMessageId = cleanText(body.replyToMessageId || "", 80);
  const clientTempId = cleanClientTempId(body.clientTempId);

  if (!text && !attachment) throw createHttpError(400, "Message cannot be empty.");

  if (clientTempId) {
    const existing = await db.collection("dmMessages").findOne({
      threadId: thread.id,
      senderId: user.id,
      clientTempId,
    });

    if (existing) {
      const users = await dmUsersForThreads([thread]);
      return {
        deduped: true,
        thread: serializeDmThread(thread, user.id, users, existing),
        message: existing,
      };
    }
  }

  const moderation = moderateText(text);
  const createdAt = new Date();
  const message = {
    id: createId("dm"),
    clientTempId,
    threadId: thread.id,
    senderId: user.id,
    recipientId,
    participantIds: (thread.participantIds || []).map(String),
    text,
    type: attachment ? "media" : "text",
    attachment,
    replyTo: replyToMessageId ? await getDmReplyPreview(replyToMessageId, thread.id) : null,
    reactions: 0,
    reactionSummary: {},
    reactionsByUser: {},
    delivery: {
      sentAt: createdAt,
      deliveredTo: [],
      seenBy: [user.id],
    },
    hiddenForUserIds: [],
    editedAt: null,
    deletedAt: null,
    deletedBy: "",
    reported: moderation.flagged,
  };

  await db.collection("dmMessages").insertOne(message);
  const storedMessage = await db.collection("dmMessages").findOne({ id: message.id });
  const lastMessageText = dmMessagePreview(storedMessage);
  await db.collection("dmThreads").updateOne(
    { id: thread.id },
    {
      $set: {
        friendshipId: friendship.id || thread.friendshipId || "",
        status: "active",
        lastMessageId: storedMessage.id,
        lastMessageText,
        lastMessageAt: createdAt,
      },
      $inc: {
        [`unreadByUserId.${String(recipientId)}`]: 1,
      },
      $pull: {
        hiddenForUserIds: { $in: [String(user.id), String(recipientId)] },
      },
    }
  );
  await db.collection("friendships").updateOne(
    { id: friendship.id },
    { $set: { lastInteractionAt: createdAt } }
  );
  const updatedThread = await db.collection("dmThreads").findOne({ id: thread.id });
  await emitDmMessageNew(updatedThread, storedMessage);
  const users = await dmUsersForThreads([updatedThread]);

  return {
    deduped: false,
    thread: serializeDmThread(updatedThread, user.id, users, storedMessage),
    message: storedMessage,
  };
}

async function markDmThreadSeen(threadId, user, options = {}) {
  const thread = await findDmThreadForUser(threadId, user);
  const seenAt = new Date();
  await db.collection("dmMessages").updateMany(
    {
      threadId: thread.id,
      recipientId: user.id,
      "delivery.seenBy": { $ne: user.id },
    },
    {
      $addToSet: {
        "delivery.deliveredTo": user.id,
        "delivery.seenBy": user.id,
      },
    }
  );
  await db.collection("dmThreads").updateOne(
    { id: thread.id },
    {
      $set: {
        [`unreadByUserId.${String(user.id)}`]: 0,
      },
    }
  );
  const updatedThread = await db.collection("dmThreads").findOne({ id: thread.id });
  const users = await dmUsersForThreads([updatedThread]);
  const payloadBase = {
    threadId: updatedThread.id,
    userId: user.id,
    seenAt: seenAt.getTime(),
  };

  if (options.emit !== false) {
    (updatedThread.participantIds || []).forEach((participantId) => {
      emitToUser(participantId, "dm:seen", {
        ...payloadBase,
        thread: serializeDmThread(updatedThread, participantId, users),
      });
    });
  }

  return {
    ...payloadBase,
    thread: serializeDmThread(updatedThread, user.id, users),
  };
}

async function emitDmThreadUpdate(thread) {
  if (!thread?.id) return;
  const users = await dmUsersForThreads([thread]);
  (thread.participantIds || []).forEach((participantId) => {
    emitToUser(participantId, "dm:thread:update", {
      thread: serializeDmThread(thread, participantId, users),
    });
  });
}

async function emitDmMessageNew(thread, message) {
  if (!thread?.id || !message?.id) return;
  const users = await dmUsersForThreads([thread]);
  (thread.participantIds || []).forEach((participantId) => {
    emitToUser(participantId, "dm:message:new", {
      thread: serializeDmThread(thread, participantId, users, message),
      message: serializeDmMessage(message),
    });
  });
}

async function updateAdminRoom(roomId, input, admin) {
  const current = await db.collection("rooms").findOne({ id: roomId });
  if (!current) throw createHttpError(404, "Room not found.");

  const updates = {
    name: cleanText(input.name || current.name, 50),
    desc: cleanText(input.desc || input.description || current.desc, 200),
    category: cleanText(input.category || current.category || "Public", 40),
    visibility: input.visibility === "private" ? "private" : "public",
    maxCapacity: Math.min(1000, Math.max(2, Number(input.maxCapacity || current.maxCapacity || DEFAULT_PLATFORM_SETTINGS.maxRoomSize))),
    passwordProtected: Boolean(input.passwordProtected),
    isPasswordProtected: Boolean(input.passwordProtected),
    hidden: Boolean(input.hidden),
    locked: Object.prototype.hasOwnProperty.call(input, "locked") ? Boolean(input.locked) : Boolean(current.locked),
    lockedUntil: Object.prototype.hasOwnProperty.call(input, "lockedUntil") ? Number(input.lockedUntil || 0) : Number(current.lockedUntil || 0),
    updatedAt: Date.now(),
  };
  updates.description = updates.desc;

  await db.collection("rooms").updateOne({ id: roomId }, { $set: updates });
  invalidateRoomsCache();
  await writeAdminAudit(admin, "room:update", { roomId });
  return removeMongoId(await db.collection("rooms").findOne({ id: roomId }));
}

async function deleteAdminRoom(roomId, admin) {
  const room = await db.collection("rooms").findOne({ id: roomId });
  if (!room) throw createHttpError(404, "Room not found.");
  if (room.isSeeded) throw createHttpError(400, "Seeded rooms cannot be deleted.");

  await db.collection("rooms").deleteOne({ id: roomId });

  await db.collection("messages").deleteMany({ roomId });
  forgetVerifiedRoom(roomId);
  invalidateRoomsCache();
  await writeAdminAudit(admin, "room:delete", { roomId });
}

async function updateAdminMessage(messageId, action, admin) {
  const message = await db.collection("messages").findOne({ id: messageId });
  if (!message) throw createHttpError(404, "Message not found.");

  let updates;
  if (action === "unflag") {
    updates = { reported: false, moderationReasons: [] };
  } else if (action === "hide") {
    updates = {
      hidden: true,
      reported: true,
      moderationReasons: [...new Set([...(message.moderationReasons || []), "Admin hidden"])],
    };
  } else if (action === "unhide") {
    updates = { hidden: false };
  } else {
    updates = { reported: true, moderationReasons: [...new Set([...(message.moderationReasons || []), "Admin flagged"])] };
  }

  await db.collection("messages").updateOne({ id: messageId }, { $set: updates });
  await writeAdminAudit(admin, `message:${action === "unflag" ? "unflag" : action === "hide" ? "hide" : action === "unhide" ? "unhide" : "flag"}`, { messageId });
  return await db.collection("messages").findOne({ id: messageId });
}

function normalizeRoomForStorage(room, overrides = {}) {
  const merged = { ...room, ...overrides };
  const slug = slugifyRoom(merged.slug || merged.id || merged.name);
  const description = cleanText(merged.description || merged.desc || "", 200);
  const isPasswordProtected = Boolean(merged.isPasswordProtected || merged.passwordProtected || merged.password || merged.passwordHash);

  return {
    ...merged,
    id: merged.id || slug,
    slug,
    description,
    desc: description,
    passwordProtected: isPasswordProtected,
    isPasswordProtected,
    status: merged.status || (merged.hidden ? "archived" : "active"),
  };
}

function serializeRoom(room = {}, user = null, accessSet = new Set()) {
  const clean = removeMongoId(room);
  const isPasswordProtected = roomRequiresPassword(clean);
  delete clean.password;
  delete clean.passwordHash;
  delete clean.passwordSalt;
  return {
    ...clean,
    passwordProtected: isPasswordProtected,
    isPasswordProtected,
    hasPassword: isPasswordProtected,
    canAccess: userCanAccessRoom(clean, user, accessSet),
  };
}

function normalizeAnnouncementTarget(target) {
  const value = String(target || "").trim().toLowerCase();
  return value === "room" || value === "rooms" ? "room" : "all";
}

function slugifyRoom(name) {
  const base = String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
  return base || createId("room");
}

function isMongoObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value || ""));
}

function objectIdFromValue(value) {
  const text = String(value || "");
  if (mongoose.Types.ObjectId.isValid(text)) return new mongoose.Types.ObjectId(text);
  return new mongoose.Types.ObjectId(crypto.createHash("sha1").update(text || "anonchat").digest("hex").slice(0, 24));
}

function initialsForRoom(name) {
  return String(name || "Room")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

function activeTyping() {
  const now = Date.now();

  for (const [key, value] of typingUsers.entries()) {
    if (value.expiresAt <= now) typingUsers.delete(key);
  }

  return [...typingUsers.values()];
}

function roomChannel(roomId) {
  return `room:${roomId}`;
}

function dmChannel(threadId) {
  return `dm:${threadId}`;
}

async function findRealtimeRoom(roomId) {
  const value = String(roomId || "");
  const filters = [{ id: value }, { slug: value }];
  if (isMongoObjectId(value)) filters.push({ _id: objectIdFromValue(value) });
  return db.collection("rooms").findOne({ $or: filters });
}

function activeSocketUserIds() {
  const userIds = new Set();

  io.sockets.sockets.forEach((socket) => {
    const user = socket.data.user;
    if (user?.id && user.role !== "admin") userIds.add(user.id);
  });

  return userIds;
}

function presencePayload(user, online = false) {
  if (!user?.id) return null;
  const privacy = user.privacySettings || {};
  const lastSeenAllowed = privacy.lastSeen !== "nobody";
  const onlineAllowed = privacy.onlineVisibility !== "nobody";
  const visibleOnline = onlineAllowed ? Boolean(online) : false;
  return {
    userId: String(user.id),
    online: visibleOnline,
    lastSeen: lastSeenAllowed || visibleOnline ? user.lastSeen || Date.now() : null,
  };
}

async function buildPresenceMap(userIds = []) {
  const ids = [...new Set(userIds.map(String).filter(Boolean))];
  if (!ids.length) return {};

  const onlineIds = activeSocketUserIds();
  const users = await db.collection("users").find(
    { id: { $in: ids } },
    { projection: { id: 1, lastSeen: 1, privacySettings: 1 } }
  ).toArray();

  return users.reduce((presence, user) => {
    const payload = presencePayload(user, onlineIds.has(String(user.id)));
    if (payload) presence[payload.userId] = payload;
    return presence;
  }, {});
}

function roomOnlineUserCount(roomId) {
  const userIds = new Set();
  io.sockets.sockets.forEach((socket) => {
    const user = socket.data.user;
    if (socket.data.roomId === roomId && user?.id && user.role !== "admin") userIds.add(user.id);
  });

  return userIds.size;
}

function emitMessageNew(message) {
  io.to(roomChannel(message.roomId)).emit("message:new", serializeMessage(message));
}

function emitMessageUpdate(message) {
  io.to(roomChannel(message.roomId)).emit("message:update", serializeMessage(message));
}

function emitMessageDelete(message, scope = "everyone") {
  io.to(roomChannel(message.roomId)).emit("message:delete", {
    messageId: message.id,
    roomId: message.roomId,
    scope,
  });
}

function emitReactionUpdate(message) {
  io.to(roomChannel(message.roomId)).emit("reaction:update", serializeMessage(message));
}

function emitAnnouncementNew(announcement) {
  io.emit("announcement:new", removeMongoId(announcement));
}

function emitAnnouncementUpdate(announcement) {
  io.emit("announcement:update", removeMongoId(announcement));
}

function emitAnnouncementDelete(announcement) {
  io.emit("announcement:delete", { id: announcement.id, announcementId: announcement.id });
}

function emitTyping(user, roomId, isTyping) {
  const eventName = isTyping ? "typing:start" : "typing:stop";

  io.to(roomChannel(roomId)).emit(eventName, {
    userId: user.id,
    name: user.anonymousName,
    roomId,
    expiresAt: Date.now() + 3500,
  });
}

function emitDmTyping(user, thread, isTyping) {
  const eventName = isTyping ? "dm:typing:start" : "dm:typing:stop";

  io.to(dmChannel(thread.id)).emit(eventName, {
    userId: user.id,
    name: displayNameForUser(user),
    threadId: thread.id,
    expiresAt: Date.now() + 3500,
  });
}

async function markMessageDelivered(messageId, user) {
  const message = await db.collection("messages").findOne({ id: messageId });

  if (!message || message.authorId === user.id) return null;

  await db.collection("messages").updateOne(
    { id: messageId },
    { $addToSet: { "delivery.deliveredTo": user.id } }
  );

  return await db.collection("messages").findOne({ id: messageId });
}

async function markRoomSeen(roomId, user) {
  await db.collection("messages").updateMany(
    {
      roomId,
      authorId: { $ne: user.id },
      hidden: { $ne: true },
      deletedFor: { $ne: user.id },
    },
    {
      $addToSet: {
        "delivery.deliveredTo": user.id,
        "delivery.seenBy": user.id,
      },
    }
  );
}

async function broadcastState() {
  const payload = await createPublicState();
  io.emit("state", payload);
  return payload;
}

async function broadcastRooms() {
  const payload = await createPublicState();
  io.emit("rooms:update", {
    rooms: payload.rooms,
    stats: payload.stats,
  });
  return payload;
}

function sanitizeUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    dateOfBirth: formatDateOfBirth(user.dateOfBirth),
    contactNumber: user.contactNumber || "",
    campus: user.campus || "",
    gender: user.gender || "",
    department: user.department || "",
    studyYear: user.studyYear || "",
    emailDomain: user.emailDomain || emailDomain(user.email),
    campusVerified: Boolean(user.campusVerified),
    name: user.anonymousName,
    about: user.about || "",
    customStatus: user.customStatus || "",
    themePreference: user.themePreference || "dark",
    avatarColor: user.avatarColor,
    avatarDataUrl: user.avatarDataUrl || "",
    privacySettings: {
      lastSeen: "everyone",
      profilePhoto: "everyone",
      anonymousMode: true,
      readReceipts: true,
      allowCalls: "everyone",
      onlineVisibility: "everyone",
      ...(user.privacySettings || {}),
    },
    blockedUsers: (user.blockedUsers || []).map(String),
    blockedUserIds: (user.blockedUserRecords || []).map((record) => String(record.userId || "")).filter(Boolean),
    role: user.role,
    status: user.status || "active",
    suspensionReason: user.suspensionReason || "",
    createdAt: user.createdAt,
    lastSeen: user.lastSeen,
  };
}

function sanitizeAdminUser(user) {
  return {
    ...sanitizeUser(user),
    status: user.status,
    provider: user.provider || "password",
  };
}

function adminUser() {
  return {
    id: "site-admin",
    username: ADMIN_USERNAME,
    email: "",
    fullName: ADMIN_NAME,
    dateOfBirth: "",
    contactNumber: "",
    campus: "Admin Console",
    gender: "",
    department: "",
    studyYear: "",
    emailDomain: "",
    campusVerified: true,
    name: ADMIN_NAME,
    about: "Site owner",
    avatarColor: "#22d3ee",
    avatarDataUrl: "",
    role: "admin",
    createdAt: 0,
    lastSeen: Date.now(),
  };
}

async function ensureNotDeleted(username, email) {
  const blocked = await db.collection("deletedUsers").findOne({
    $or: [{ username }, { email }],
  });

  if (blocked) {
    throw createHttpError(403, "This account was permanently removed by the site admin.");
  }
}

async function generateAnonymousName() {
  const users = await db.collection("users").find({}, { projection: { anonymousName: 1 } }).toArray();
  const usedNames = new Set(users.map((user) => user.anonymousName));

  const available = anonymousNames.filter((name) => !usedNames.has(name));

  return available.length > 0 ? pick(available) : `${pick(anonymousNames)} ${randomNumber(10, 99)}`;
}

function validateUsername(username) {
  if (!/^[a-z0-9_]{3,24}$/.test(username)) {
    throw createHttpError(400, "Username must be 3-24 characters using letters, numbers, or underscore.");
  }
}

function validateEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createHttpError(400, "Enter a valid email address.");
  }
}

function validateContact(contactNumber) {
  if (!/^\+?[0-9\s-]{7,20}$/.test(contactNumber)) {
    throw createHttpError(400, "Enter a valid contact number.");
  }
}

function validatePassword(password) {
  const allowedPattern = /^[A-Za-z0-9!@#$%^&*_\-+=.?]{8,64}$/;

  if (!allowedPattern.test(password)) throw createHttpError(400, PASSWORD_RULE_MESSAGE);

  if (
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*_\-+=.?]/.test(password)
  ) {
    throw createHttpError(400, PASSWORD_RULE_MESSAGE);
  }
}

function normalizeAttachment(attachment) {
  if (!attachment) return null;

  const mimeType = normalizeMimeType(attachment.mimeType);
  const name = cleanText(attachment.name || "attachment", 120);
  const dataUrl = String(attachment.dataUrl || "");
  const url = String(attachment.url || "");
  const size = Number(attachment.size || 0);
  const rawKind = cleanText(attachment.kind || attachmentKindFromMime(mimeType), 20);
  const kind = ["image", "video", "audio", "file"].includes(rawKind) ? rawKind : "file";
  const dataUrlMimeMatch = dataUrl.match(/^data:([^;,]+)(?:;[^,]*)?;base64,/i);
  const hasBase64 = Boolean(dataUrlMimeMatch && normalizeMimeType(dataUrlMimeMatch[1]) === mimeType);
  const remoteUrl = /^https?:\/\/\S+$/i.test(url) ? url : /^https?:\/\/\S+$/i.test(dataUrl) ? dataUrl : "";

  validateUploadPayload({ mimeType, size, kind, dataUrl: hasBase64 ? dataUrl : "" });

  if (!hasBase64 && !remoteUrl) {
    throw createHttpError(400, "Invalid attachment data.");
  }

  return {
    kind,
    name,
    mimeType,
    size,
    dataUrl: hasBase64 ? dataUrl : "",
    url: remoteUrl,
    publicId: cleanText(attachment.publicId || "", 180),
    storage: cleanText(attachment.storage || (remoteUrl ? "remote" : "base64"), 30),
    voiceNote: Boolean(attachment.voiceNote),
    duration: Math.max(0, Math.min(60 * 60, Number(attachment.duration || 0))),
  };
}

function moderateText(text) {
  const value = String(text || "").toLowerCase();
  const reasons = [];

  for (const word of bannedWords) {
    if (value.includes(word)) reasons.push(`blocked word: ${word}`);
  }

  if (/https?:\/\/|www\./i.test(text)) reasons.push("external link");
  if (/\b\d{10,}\b/.test(text)) reasons.push("possible phone number");
  if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(text)) reasons.push("possible email address");

  return {
    flagged: reasons.length > 0,
    reasons,
  };
}

function normalizeUsername(username) {
  return String(username || "").trim().toLowerCase();
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeContact(contactNumber) {
  return String(contactNumber || "").trim();
}

function normalizeGender(gender) {
  const value = String(gender || "").trim().toLowerCase();
  return ["male", "female", "other"].includes(value) ? value : "";
}

function normalizeStudyYear(studyYear) {
  const value = String(studyYear || "").trim();
  return ["1", "2", "3", "4", "5", "alumni"].includes(value) ? value : "";
}

function normalizeDateOfBirth(value) {
  const text = String(value || "").trim();
  if (!text) throw createHttpError(400, "Date of birth is required.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw createHttpError(400, "Enter a valid date of birth.");

  const date = new Date(`${text}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== text) {
    throw createHttpError(400, "Enter a valid date of birth.");
  }

  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  if (date.getTime() > todayUtc) throw createHttpError(400, "Date of birth cannot be in the future.");

  return date;
}

function formatDateOfBirth(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function emailDomain(email) {
  return String(email || "").split("@")[1] || "";
}

function isCampusEmail(email) {
  const domain = emailDomain(email);
  return Boolean(domain && !PUBLIC_EMAIL_DOMAINS.has(domain));
}

function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanClientTempId(value) {
  const text = String(value || "").trim().slice(0, 120);
  return /^[a-zA-Z0-9:_-]{8,120}$/.test(text) ? text : "";
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");

  return { salt, hash };
}

function verifyPassword(password, salt, expectedHash) {
  if (!salt || !expectedHash) return false;

  const { hash } = hashPassword(password, salt);

  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(expectedHash, "hex"));
}

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token || "")).digest("hex");
}

function createId(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString("hex")}`;
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clampOtpExpireMinutes(value) {
  const minutes = Number(value || 10);
  if (!Number.isFinite(minutes)) return 10;
  return Math.min(10, Math.max(5, Math.round(minutes)));
}

function capitalize(value) {
  return String(value || "").charAt(0).toUpperCase() + String(value || "").slice(1);
}

function removeMongoId(item) {
  if (!item || typeof item !== "object") return item;

  const { _id, ...clean } = item;

  return clean;
}

function serializeMessage(message) {
  if (!message || typeof message !== "object") return message;
  const normalized = normalizeDocument(message);
  const id = String(normalized.id || normalized._id || "");

  return {
    ...normalized,
    id,
    _id: normalized._id ? String(normalized._id) : undefined,
    clientTempId: normalized.clientTempId || "",
  };
}

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;

  return error;
}

function handleError(res, error) {
  const status = error.status || 500;

  if (status >= 500) {
    console.error(error);
  } else {
    console.warn(`[${status}] ${error.message || "Request rejected."}`);
  }

  const payload = {
    error: error.message || "Something went wrong on the server.",
    status,
  };

  if (process.env.NODE_ENV !== "production" && status >= 500 && error.stack) {
    payload.stack = error.stack;
  }

  res.status(status).json(payload);
}

function socketUserIds(userId) {
  const ids = [];
  io.sockets.sockets.forEach((candidate) => {
    if (String(candidate.data.user?.id || "") === String(userId || "")) {
      ids.push(candidate.id);
    }
  });
  return ids;
}

function emitToUser(userId, event, payload) {
  socketUserIds(userId).forEach((socketId) => io.to(socketId).emit(event, payload));
}

function userHasActiveCall(userId) {
  return activeCallsByUser.has(String(userId || ""));
}

function setCallActive(call) {
  activeCallsByUser.set(String(call.callerId), call.id);
  activeCallsByUser.set(String(call.targetId), call.id);
  callSessions.set(call.id, call);
  io.emit("admin:call-activity", {
    type: "started",
    callId: call.id,
    callType: call.type,
    callerName: call.caller?.name || call.callerName || "Anonymous User",
    targetName: call.target?.name || call.targetName || "Anonymous User",
    roomId: call.roomId || "",
    activeCalls: callSessions.size,
    createdAt: Date.now(),
  });
}

function clearCallActive(call) {
  if (!call) return;
  if (activeCallsByUser.get(String(call.callerId)) === call.id) activeCallsByUser.delete(String(call.callerId));
  if (activeCallsByUser.get(String(call.targetId)) === call.id) activeCallsByUser.delete(String(call.targetId));
  callSessions.delete(call.id);
  io.emit("admin:call-activity", {
    type: "ended",
    callId: call.id,
    callType: call.type,
    callerName: call.caller?.name || call.callerName || "Anonymous User",
    targetName: call.target?.name || call.targetName || "Anonymous User",
    roomId: call.roomId || "",
    activeCalls: callSessions.size,
    createdAt: Date.now(),
  });
}

function callPeerId(call, userId) {
  return String(call.callerId) === String(userId) ? call.targetId : call.callerId;
}

async function usersBlockedEitherWay(firstUser, secondUser) {
  if (!firstUser?.id || !secondUser?.id) return true;
  const [firstBlocked, secondBlocked] = await Promise.all([
    blockedAuthorIds(firstUser),
    blockedAuthorIds(secondUser),
  ]);
  return firstBlocked.has(String(secondUser.id)) || secondBlocked.has(String(firstUser.id));
}

function roomHasUserOnline(roomId, userId) {
  let found = false;
  io.sockets.sockets.forEach((candidate) => {
    if (String(candidate.data.roomId || "") === String(roomId || "") && String(candidate.data.user?.id || "") === String(userId || "")) {
      found = true;
    }
  });
  return found;
}

function canReceiveCallFrom(targetUser, callerUser, roomId) {
  const setting = targetUser?.privacySettings?.allowCalls || "everyone";
  if (setting === "nobody") return false;
  if (setting === "my-rooms") {
    return Boolean(roomId && roomHasUserOnline(roomId, targetUser.id) && roomHasUserOnline(roomId, callerUser.id));
  }
  return true;
}

async function saveCallMetadata(call, status, durationSeconds = 0) {
  const endedAt = Date.now();
  const document = {
    id: call.id,
    type: call.type,
    callerId: call.callerId,
    callerName: call.caller?.name || call.callerName || "Anonymous User",
    targetId: call.targetId,
    targetName: call.target?.name || call.targetName || "Anonymous User",
    roomId: call.roomId || "",
    status,
    startedAt: call.startedAt,
    answeredAt: call.answeredAt || null,
    endedAt,
    durationSeconds,
  };

  await db.collection("calls").updateOne(
    { id: call.id },
    { $set: document, $setOnInsert: { createdAt: call.startedAt || endedAt } },
    { upsert: true }
  );

  return document;
}

async function createCallMessage(call, status, durationSeconds = 0) {
  if (!call?.roomId) return null;
  const room = await db.collection("rooms").findOne({ id: call.roomId });
  if (!room) return null;

  const label = call.type === "video" ? "Video call" : "Audio call";
  const text = status === "missed"
    ? `Missed ${call.type} call`
    : status === "rejected"
      ? `${label} declined`
      : `${label} ended${durationSeconds ? ` - ${formatCallDuration(durationSeconds)}` : ""}`;
  const createdAt = Date.now();
  const message = {
    id: createId("call"),
    roomId: room.id,
    authorId: call.callerId,
    author: call.caller?.name || call.callerName || "Anonymous User",
    avatarColor: call.caller?.avatarColor || "#6c63ff",
    avatarDataUrl: call.caller?.avatarDataUrl || "",
    text,
    type: "system",
    call: {
      id: call.id,
      type: call.type,
      status,
      durationSeconds,
      callerId: call.callerId,
      targetId: call.targetId,
    },
    attachment: null,
    replyTo: null,
    createdAt,
    editedAt: null,
    reactions: 0,
    reactedBy: [],
    reactionSummary: {},
    reactionsByUser: {},
    deletedFor: [],
    delivery: { sentAt: createdAt, deliveredTo: [], seenBy: [] },
    reported: false,
    moderationReasons: [],
    hidden: false,
  };

  await db.collection("messages").insertOne(message);
  emitMessageNew(message);
  await broadcastRooms();
  return message;
}

function formatCallDuration(seconds) {
  const safe = Math.max(0, Number(seconds || 0));
  const minutes = Math.floor(safe / 60);
  const remainder = safe % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

async function identifySocketSession(token) {
  try {
    return await requireUser(token);
  } catch (userError) {
    try {
      return await requireAdmin(token);
    } catch (adminError) {
      throw userError;
    }
  }
}

io.on("connection", async (socket) => {
  try {
    let socketUser = null;
    const handshakeToken = String(socket.handshake?.auth?.token || socket.handshake?.query?.token || "").trim();

    if (handshakeToken) {
      try {
        socketUser = await identifySocketSession(handshakeToken);
        if (socketUser.role !== "admin") ensureActiveUser(socketUser);
        socket.data.user = socketUser;
      } catch (authError) {
        socketUser = null;
      }
    }

    socket.emit("state", await createPublicState(socketUser?.role === "admin" ? null : socketUser));
  } catch (error) {
    console.error("Socket state emit failed:", error);
    socket.emit("server-error", { error: "Live state is temporarily unavailable." });
  }

  socket.on("presence:online", async ({ token } = {}) => {
    try {
      const user = await identifySocketSession(token);
      if (user.role !== "admin") ensureActiveUser(user);
      socket.data.user = user;
      io.emit("presence:update", { presence: { [user.id]: presencePayload(user, true) } });
      await broadcastRooms();
    } catch (error) {
      socket.emit("server-error", { error: error.message || "Presence update failed." });
    }
  });

  socket.on("room:join", async ({ token, roomId } = {}, ack) => {
    try {
      const room = await findRealtimeRoom(roomId);
      if (!room) throw createHttpError(404, "Room not found.");

      const user = await identifySocketSession(token);
      if (user.role !== "admin") ensureActiveUser(user);
      if (user.role !== "admin") await requireRoomEntry(room, user);

      if (socket.data.roomId) {
        socket.leave(roomChannel(socket.data.roomId));
      }

      socket.data.user = user;
      socket.data.roomId = room.id;
      socket.join(roomChannel(room.id));
      io.emit("presence:update", { presence: { [user.id]: presencePayload(user, true) } });

      if (user.role !== "admin") {
        await markRoomSeen(room.id, user);
        io.to(roomChannel(room.id)).emit("message:seen", {
          roomId: room.id,
          userId: user.id,
        });
      }

      await broadcastRooms();
      if (typeof ack === "function") ack({ ok: true, roomId: room.id });
    } catch (error) {
      socket.emit("server-error", { error: error.message || "Room join failed." });
      if (typeof ack === "function") {
        ack({ ok: false, error: error.message || "Room join failed." });
      }
    }
  });

  socket.on("room:leave", async ({ token, roomId } = {}) => {
    try {
      const user = await identifySocketSession(token);
      if (user.role !== "admin") ensureActiveUser(user);

      if (!roomId || socket.data.roomId === roomId) {
        if (socket.data.roomId) socket.leave(roomChannel(socket.data.roomId));
        socket.data.roomId = "";
      } else {
        socket.leave(roomChannel(roomId));
      }

      socket.data.user = user;
      await broadcastRooms();
    } catch (error) {
      socket.emit("server-error", { error: error.message || "Room leave failed." });
    }
  });

  socket.on("dm:join", async ({ token, threadId } = {}, ack) => {
    try {
      const user = await requireUser(token);
      ensureActiveUser(user);
      const thread = await findDmThreadForUser(threadId, user);

      if (socket.data.dmThreadId) {
        socket.leave(dmChannel(socket.data.dmThreadId));
      }

      socket.data.user = user;
      socket.data.dmThreadId = thread.id;
      socket.join(dmChannel(thread.id));
      await markDmThreadSeen(thread.id, user);
      if (typeof ack === "function") ack({ ok: true, threadId: thread.id });
    } catch (error) {
      socket.emit("server-error", { error: error.message || "Personal chat join failed." });
      if (typeof ack === "function") {
        ack({ ok: false, error: error.message || "Personal chat join failed." });
      }
    }
  });

  socket.on("dm:leave", async ({ token, threadId } = {}) => {
    try {
      const user = await requireUser(token);
      ensureActiveUser(user);

      if (!threadId || socket.data.dmThreadId === threadId) {
        if (socket.data.dmThreadId) socket.leave(dmChannel(socket.data.dmThreadId));
        socket.data.dmThreadId = "";
      } else {
        socket.leave(dmChannel(threadId));
      }

      socket.data.user = user;
    } catch (error) {
      socket.emit("server-error", { error: error.message || "Personal chat leave failed." });
    }
  });

  socket.on("dm:seen", async ({ token, threadId } = {}) => {
    try {
      const user = await requireUser(token);
      ensureActiveUser(user);
      await markDmThreadSeen(threadId, user);
    } catch (error) {
      socket.emit("server-error", { error: error.message || "Personal chat seen update failed." });
    }
  });

  socket.on("message:delivered", async ({ token, messageId } = {}) => {
    try {
      const user = await requireUser(token);
      ensureActiveUser(user);
      const message = await markMessageDelivered(messageId, user);
      if (message) {
        io.to(roomChannel(message.roomId)).emit("message:delivery", serializeMessage(message));
      }
    } catch (error) {
      socket.emit("server-error", { error: error.message || "Delivery update failed." });
    }
  });

  socket.on("message:seen", async ({ token, roomId } = {}) => {
    try {
      const user = await requireUser(token);
      ensureActiveUser(user);
      await markRoomSeen(roomId, user);
      io.to(roomChannel(roomId)).emit("message:seen", {
        roomId,
        userId: user.id,
      });
    } catch (error) {
      socket.emit("server-error", { error: error.message || "Seen update failed." });
    }
  });

  socket.on("typing:start", async ({ token, roomId } = {}) => {
    try {
      const user = await requireUser(token);
      ensureActiveUser(user);
      const room = await findRealtimeRoom(roomId);
      if (!room) throw createHttpError(404, "Room not found.");
      await requireRoomEntry(room, user);
      socket.data.user = user;
      handleTyping(user, { roomId: room.id, isTyping: true });
    } catch (error) {
      socket.emit("server-error", { error: error.message || "Typing update failed." });
    }
  });

  socket.on("typing:stop", async ({ token, roomId } = {}) => {
    try {
      const user = await requireUser(token);
      ensureActiveUser(user);
      const room = await findRealtimeRoom(roomId);
      if (!room) throw createHttpError(404, "Room not found.");
      await requireRoomEntry(room, user);
      socket.data.user = user;
      handleTyping(user, { roomId: room.id, isTyping: false });
    } catch (error) {
      socket.emit("server-error", { error: error.message || "Typing update failed." });
    }
  });

  socket.on("dm:typing:start", async ({ token, threadId } = {}) => {
    try {
      const user = await requireUser(token);
      ensureActiveUser(user);
      const thread = await findDmThreadForUser(threadId, user);
      socket.data.user = user;
      socket.join(dmChannel(thread.id));
      emitDmTyping(user, thread, true);
    } catch (error) {
      socket.emit("server-error", { error: error.message || "Personal chat typing failed." });
    }
  });

  socket.on("dm:typing:stop", async ({ token, threadId } = {}) => {
    try {
      const user = await requireUser(token);
      ensureActiveUser(user);
      const thread = await findDmThreadForUser(threadId, user);
      socket.data.user = user;
      emitDmTyping(user, thread, false);
    } catch (error) {
      socket.emit("server-error", { error: error.message || "Personal chat typing failed." });
    }
  });

  socket.on("call:offer", async (payload = {}, ack) => {
    try {
      const caller = await requireUser(payload.token);
      ensureActiveUser(caller);
      socket.data.user = caller;

      const targetId = cleanText(payload.targetUserId, 80);
      const callType = payload.type === "video" ? "video" : "audio";
      const targetFilters = [{ id: targetId }];
      if (isMongoObjectId(targetId)) targetFilters.push({ _id: objectIdFromValue(targetId) });
      const target = await db.collection("users").findOne({ $or: targetFilters, status: { $ne: "deleted" } });
      if (!target) throw createHttpError(404, "User is offline or unavailable.");
      ensureActiveUser(target);
      if (target.id === caller.id) throw createHttpError(400, "You cannot call yourself.");
      if (await usersBlockedEitherWay(caller, target)) throw createHttpError(403, "Calls are blocked with this user.");
      if (!canReceiveCallFrom(target, caller, payload.roomId || socket.data.roomId)) {
        throw createHttpError(403, "This user is not accepting calls right now.");
      }

      const targetSockets = socketUserIds(target.id);
      if (!targetSockets.length) {
        socket.emit("call:offline", { targetUserId: target.id });
        if (typeof ack === "function") ack({ ok: false, reason: "offline" });
        return;
      }

      if (userHasActiveCall(caller.id)) {
        socket.emit("call:busy", { userId: caller.id, reason: "caller-busy" });
        if (typeof ack === "function") ack({ ok: false, reason: "busy" });
        return;
      }

      if (userHasActiveCall(target.id)) {
        socket.emit("call:busy", { userId: target.id, reason: "callee-busy" });
        emitToUser(target.id, "call:busy", { userId: caller.id, reason: "incoming-while-busy" });
        if (typeof ack === "function") ack({ ok: false, reason: "busy" });
        return;
      }

      const call = {
        id: cleanText(payload.callId, 80) || createId("call"),
        type: callType,
        callerId: caller.id,
        caller: sanitizeUser(caller),
        targetId: target.id,
        target: sanitizeUser(target),
        roomId: cleanText(payload.roomId || socket.data.roomId || "", 80),
        status: "ringing",
        startedAt: Date.now(),
        answeredAt: null,
      };
      setCallActive(call);

      emitToUser(target.id, "call:incoming", {
        callId: call.id,
        type: call.type,
        roomId: call.roomId,
        caller: call.caller,
        offer: payload.offer,
      });
      socket.emit("call:ringing", { callId: call.id, target: call.target, type: call.type });
      if (typeof ack === "function") ack({ ok: true, callId: call.id });
    } catch (error) {
      socket.emit("call:error", { error: error.message || "Call failed." });
      if (typeof ack === "function") ack({ ok: false, error: error.message || "Call failed." });
    }
  });

  socket.on("call:answer", async (payload = {}) => {
    try {
      const user = await requireUser(payload.token);
      ensureActiveUser(user);
      socket.data.user = user;
      const call = callSessions.get(String(payload.callId || ""));
      if (!call || String(call.targetId) !== String(user.id)) throw createHttpError(404, "Call is no longer available.");
      call.status = "active";
      call.answeredAt = Date.now();
      callSessions.set(call.id, call);
      emitToUser(call.callerId, "call:answer", { callId: call.id, answer: payload.answer, user: sanitizeUser(user) });
    } catch (error) {
      socket.emit("call:error", { error: error.message || "Could not answer call." });
    }
  });

  socket.on("call:ice-candidate", async (payload = {}) => {
    try {
      const user = await requireUser(payload.token);
      ensureActiveUser(user);
      const call = callSessions.get(String(payload.callId || ""));
      if (!call) return;
      if (![call.callerId, call.targetId].map(String).includes(String(user.id))) return;
      emitToUser(callPeerId(call, user.id), "call:ice-candidate", {
        callId: call.id,
        candidate: payload.candidate,
        fromUserId: user.id,
      });
    } catch (error) {
      socket.emit("call:error", { error: error.message || "ICE signaling failed." });
    }
  });

  socket.on("call:reject", async (payload = {}) => {
    try {
      const user = await requireUser(payload.token);
      ensureActiveUser(user);
      const call = callSessions.get(String(payload.callId || ""));
      if (!call) return;
      if (![call.callerId, call.targetId].map(String).includes(String(user.id))) return;
      if (call.status === "active") return;
      clearCallActive(call);
      await saveCallMetadata(call, payload.reason === "busy" ? "busy" : "rejected", 0);
      await createCallMessage(call, "rejected", 0);
      emitToUser(callPeerId(call, user.id), payload.reason === "busy" ? "call:busy" : "call:reject", {
        callId: call.id,
        reason: payload.reason || "rejected",
        fromUserId: user.id,
      });
    } catch (error) {
      socket.emit("call:error", { error: error.message || "Call reject failed." });
    }
  });

  socket.on("call:missed", async (payload = {}) => {
    try {
      const user = await requireUser(payload.token);
      ensureActiveUser(user);
      const call = callSessions.get(String(payload.callId || ""));
      if (!call) return;
      if (![call.callerId, call.targetId].map(String).includes(String(user.id))) return;
      if (call.status === "active") return;
      clearCallActive(call);
      await saveCallMetadata(call, "missed", 0);
      await createCallMessage(call, "missed", 0);
      emitToUser(callPeerId(call, user.id), "call:missed", { callId: call.id, fromUserId: user.id });
    } catch (error) {
      socket.emit("call:error", { error: error.message || "Missed call update failed." });
    }
  });

  socket.on("call:end", async (payload = {}) => {
    try {
      const user = await requireUser(payload.token);
      ensureActiveUser(user);
      const call = callSessions.get(String(payload.callId || ""));
      if (!call) return;
      if (![call.callerId, call.targetId].map(String).includes(String(user.id))) return;
      const durationSeconds = Math.max(0, Math.round(Number(payload.durationSeconds || 0)));
      clearCallActive(call);
      await saveCallMetadata(call, "ended", durationSeconds);
      await createCallMessage(call, "ended", durationSeconds);
      emitToUser(callPeerId(call, user.id), "call:end", {
        callId: call.id,
        durationSeconds,
        fromUserId: user.id,
      });
    } catch (error) {
      socket.emit("call:error", { error: error.message || "Call end failed." });
    }
  });

  socket.on("disconnecting", () => {
    const userId = socket.data.user?.id;
    const callId = activeCallsByUser.get(String(userId || ""));
    const call = callId ? callSessions.get(callId) : null;
    if (call) {
      clearCallActive(call);
      emitToUser(callPeerId(call, userId), "call:end", {
        callId: call.id,
        reason: "disconnect",
        fromUserId: userId,
      });
      saveCallMetadata(call, "ended", 0).catch(console.warn);
      createCallMessage(call, "ended", 0).catch(console.warn);
    }
    socket.data.roomId = "";
  });

  socket.on("disconnect", async () => {
    try {
      const user = socket.data.user;
      if (user?.id && user.role !== "admin") {
        const now = Date.now();
        await db.collection("users").updateOne({ id: user.id }, { $set: { lastSeen: now } });
        if (!activeSocketUserIds().has(String(user.id))) {
          io.emit("presence:update", {
            presence: {
              [user.id]: presencePayload({ ...user, lastSeen: now }, false),
            },
          });
        }
      }
      await broadcastRooms();
    } catch (error) {
      console.error("Presence broadcast failed:", error);
    }
  });
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
    console.error("Another AnonChat server is already running. Use that browser tab or stop the old process first.");
    console.error(`PowerShell: netstat -ano | Select-String ":${PORT}"`);
    console.error("Then stop the LISTENING PID with: Stop-Process -Id <PID>");
    process.exit(1);
  }

  console.error("HTTP server failed:", error);
  process.exit(1);
});

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      devLog(`🚀 AnonChat backend running at http://localhost:${PORT}`);
      devLog(`✅ Database: ${databaseLabel}`);
      devLog(`✅ Admin login: ${ADMIN_USERNAME} / set ADMIN_PASSWORD before hosting`);
    });
  })
  .catch((error) => {
    if (!error.startupLogged) {
      console.error("MongoDB connection failed:", error.message || error);
    }
    process.exit(1);
  });

function gracefulShutdown(signal) {
  devLog(`\nReceived ${signal}. Shutting down gracefully...`);
  const forceExitTimer = setTimeout(() => {
    console.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);

  server.close(async () => {
    clearTimeout(forceExitTimer);
    devLog("HTTP server closed.");
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      devLog("MongoDB connection closed.");
    }
    process.exit(0);
  });
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
