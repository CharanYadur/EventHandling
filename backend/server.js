const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const ticketRoutes = require("./routes/ticketRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const showRoutes = require("./routes/showRoutes");
const emailRoutes = require("./routes/email");


const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" })); // allow larger JSON payloads
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


app.use("/api/tickets", ticketRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/shows", showRoutes);

app.use("/uploads", express.static("uploads"));
app.use("/api", emailRoutes);
app.use("/api/email", emailRoutes);


const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
