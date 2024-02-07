const express = require('express');

const verifyUser = require("../middleware/verifyuser");
const Wishlist = require("../model/wishlist.model");


const router = express.Router();

router.route("/")
    .post(verifyUser, async (req, res) => {
        const newWishlist = new Wishlist(req.body);
        try {
            const savedWishlist = await newWishlist.save();
            return res.status(201).json(savedWishlist);
        }catch(err){
            return res.status(500).json({ message: "failed to create wishlist" })
        }
    })



module.exports = router;