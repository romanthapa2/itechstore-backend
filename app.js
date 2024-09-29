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

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

const adminRoutes = require("./routes/admin.routes.js");
const filterRoutes = require("./routes/filter.routes.js");
const userRoutes = require("./routes/user.routes.js");

// app.use("/api/admin",verifyAdminByJwt, adminRoutes);
app.use("/api/filter", filterRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
