const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');

// Connect to the MongoDB database
connectToMongo();

const app = express();
const port = 5000;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
const adminRoutes = require("./routes/Admin");
app.use('/api/admin', adminRoutes);

const filterRoutes = require("./filter/filter");
app.use('/filter', filterRoutes);

const userRoutes = require("./routes/auth");
app.use('/auth', userRoutes);

// Static file serving
app.use('/uploads', express.static('uploads'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
