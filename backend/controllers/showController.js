  const Show = require("../models/Show");

  exports.getShows = async (req, res) => {
    try {
      const shows = await Show.find();
      res.json(shows);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

exports.createShow = async (req, res) => {
  try {
    console.log("Incoming show:", req.body);  
    const show = new Show(req.body);
    await show.save();
    res.status(201).json(show);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json(show);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json({ message: "Show deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};