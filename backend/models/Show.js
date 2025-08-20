const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  shortDescription: { type: String, required: true },
  place: { type: String, required: true },
  hall: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  showType: { type: String, required: true },
  cost: { type: Number, required: true },
  image1: { type: String },
  image2: { type: String },
  // auditoriumImage: { type: String }, // ✅ New Field
  seatAvailable: { type: Boolean, default: true },
  addedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Show", showSchema);
