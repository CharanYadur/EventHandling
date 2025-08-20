const express = require("express");
const router = express.Router();
const { getShows, createShow, updateShow, deleteShow } = require("../controllers/showController");

router.get("/", getShows);
router.post("/", createShow);
router.put("/:id", updateShow);      
router.delete("/:id", deleteShow);   

module.exports = router;
