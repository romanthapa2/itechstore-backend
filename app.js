const cors = require("cors");
const express = require("express");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

const adminRoutes = require("./routes/admin.routes.js");
const filterRoutes = require("./routes/filter.routes.js");
const userRoutes = require("./routes/user.routes.js");

app.use("/api/admin", adminRoutes);
app.use("/api/filter", filterRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
