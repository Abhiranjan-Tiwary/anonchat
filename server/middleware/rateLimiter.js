import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: process.env.NODE_ENV !== "production" ? 5 * 60 * 1000 : 10 * 60 * 1000,
  max: process.env.NODE_ENV !== "production" ? 200 : 60,
  message: {
    error: "Too many authentication requests. Please wait briefly and try again.",
  },
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    error: "Too many requests. Slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const messageLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    error: "Sending too fast. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
