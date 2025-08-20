const Ticket = require("../models/Ticket");

exports.bookTicket = async (req, res) => {
  try {
    const { showId, email, mobile, ticketHolders, ticketsCount, totalAmount, paymentId } = req.body;

    if (!showId || !ticketsCount || !totalAmount || !email || !mobile) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    if (!Array.isArray(ticketHolders) || ticketHolders.length !== ticketsCount) {
      return res.status(400).json({ success: false, message: "Ticket holders count mismatch" });
    }

    const ticket = await Ticket.create({
      show: showId,
      email,
      mobile,
      ticketHolders,
      ticketsCount,
      totalAmount,
      paymentId,
    });

    res.status(201).json({ success: true, ticket });
  } catch (err) {
    console.error("Error booking ticket:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("show");
    res.json(tickets);
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ success: false, message: "Failed to fetch tickets" });
  }
};


exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Ticket.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }
    res.json({ success: true, message: "Ticket deleted" });
  } catch (err) {
    console.error("Error deleting ticket:", err);
    res.status(400).json({ success: false, message: "Invalid ticket id" });
  }
};