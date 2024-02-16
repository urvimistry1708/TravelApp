const express = require('express');

const verifyUser = require("../middleware/verifyuser");
const User = require("../model/user.model");


const router = express.Router();

// Add hotel to wishlist
router.route("/")
    .post(verifyUser, async (req, res) => {
        try {
            
            const userId = req.user.user._id;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            console.log("User: "+user);
            const newWishlistItem = { hotelId: req.body.hotelId }; 

            user.wishlist.push(newWishlistItem);
            const userdata=await user.save();
            return res.status(201).json(userdata)

        } catch (err) {
            return res.status(500).json({ message: "failed to create wishlist" })
        }
    })



module.exports = router;