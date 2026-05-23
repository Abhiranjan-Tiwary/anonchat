import jwt from "jsonwebtoken";

async function loadUserModel() {
  try {
    const module = await import("../models/User.js");
    return module.default;
  } catch {
    throw Object.assign(new Error("User model is not configured yet."), { status: 500 });
  }
}

export async function protect(req, res, next) {
  try {
    const token =
      req.body?.token ||
      req.query?.token ||
      req.headers.token ||
      req.headers["x-auth-token"] ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Session expired. Please log in again.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const User = await loadUserModel();
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        error: "User not found. Please log in again.",
      });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({
      error: "Session expired. Please log in again.",
    });
  }
}
