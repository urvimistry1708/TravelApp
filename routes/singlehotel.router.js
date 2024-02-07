const express = require('express');
const router = express.Router();

const Hotel = require("../model/hotel.model");

router.route("/:id")
    .get(async (req, res) => {
        try {
            const { id } = req.params;
            const hotel = await Hotel.findById(id);
            return res.json(hotel)
        } catch (err) {
            return res.status(404).json({ message: "No hotel found" })
        }
    })

module.exports = router;