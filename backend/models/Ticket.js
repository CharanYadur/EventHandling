const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    ticketHolders: [{ type: String, required: true }], 
    ticketsCount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentId: { type: String }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
