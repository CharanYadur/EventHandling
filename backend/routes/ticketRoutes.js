const express = require("express");
const { bookTicket, getTickets, deleteTicket } = require("../controllers/ticketController");
const router = express.Router();

router.post("/book", bookTicket);
router.get("/", getTickets);
router.delete("/:id", deleteTicket); 

module.exports = router;
