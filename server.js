require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes.js");

const app = express();
const PORT = process.env.PORT;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Connect to MongoDB and Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Da Server BUSSING on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("error:", err);
  });
