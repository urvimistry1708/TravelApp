const express = require('express');
const verifyUser = require("../middleware/verifyuser");
const Category = require("../model/category.model");
const categories = require("../data/categories");

const router = express.Router();

// Add categories
router.route("/")
    .post(verifyUser,async (req, res) => {
        try{
            await Category.deleteMany();
            const categoriesInDB = await Category.insertMany(categories.data);
            return res.json(categoriesInDB)
        }catch(err){
            console.log(err);
            return res.json({ message: "Could not add categories to DB"})
        }
    })

module.exports = router;