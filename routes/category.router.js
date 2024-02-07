const express = require('express');
const router = express.Router();

const Category = require("../model/category.model");

router.route("/")
    .get(async (req, res) => {
        try {
            const categories = await Category.find({});
            return res.json(categories)
        } catch (err) {
            return res.status(404).json({ message: "Could not find categories" })
        }
    })

module.exports = router;