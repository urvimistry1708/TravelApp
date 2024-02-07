const express=require('express');
const verifyUser = require("../middleware/verifyuser");
const Hotel = require("../model/hotel.model");
const hotels = require("../data/hotels");

const router = express.Router();

router.route("/")
    .post(verifyUser,async (req, res) => {
        try{
            await Hotel.deleteMany();
            const hotelsInDB = await Hotel.insertMany(hotels.data);
            return res.json(hotelsInDB)
        }catch(err){
            console.log(err);
            return res.json({ message: "Could not add data to DB"})
        }
    })

module.exports = router;