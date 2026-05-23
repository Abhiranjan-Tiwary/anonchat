export default function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack || err);
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({
      error: messages[0],
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "Field";
    return res.status(400).json({
      error: `${field} is already taken.`,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      error: "Invalid ID format.",
    });
  }

  return res.status(err.status || 500).json({
    error: err.message || "Something went wrong.",
  });
}
