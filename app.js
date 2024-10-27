const cors = require("cors");
const express = require("express");
const verifyAdminByJwt = require("./middleware/auth.middlware.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function cacheImages(req, res, next) {
  if (
    req.url.endsWith(".jpg") ||
    req.url.endsWith(".jpeg") ||
    req.url.endsWith(".png") ||
    req.url.endsWith(".webp")
  ) {
    res.setHeader("Cache-Control", "public, max-age=31536000");
  } else {
    res.setHeader("Cache-Control", "public, max-age=0");
  }
  next();
}

app.use("/uploads", cacheImages, express.static("uploads"));

const adminRoutes = require("./routes/admin.routes.js");
const filterRoutes = require("./routes/filter.routes.js");
const userRoutes = require("./routes/user.routes.js");

// app.use("/api/admin",verifyAdminByJwt, adminRoutes);
app.use("/api/filter", filterRoutes);
app.use("/api/user", userRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const success = err.success || false;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success,
    message,
    statusCode,
  });
});

module.exports = app;
