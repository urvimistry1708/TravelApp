const express= require('express');
const mongoose= require('mongoose');

const hotelRouter=require("./routes/hotel.router");
const categoryRouter = require("./routes/category.router");
const singleHotelRouter= require("./routes/singlehotel.router");
const authRouter = require("./routes/auth.router");
const wishlistRouter = require("./routes/wishlist.router");

const hotelDataAddedToDBRouter=require("./routes/dataimport.router");
const categoryDataAddedToDBRouter = require("./routes/categoryimport.router");
const connectDB=require("./config/dbconfig");
const dotenv = require('dotenv');

dotenv.config();
const app= express();

app.use(express.json())

connectDB();

const PORT= 3000;
app.get("/",(req,res)=>{
    res.send("Hey")
})



app.use("/api/hotedata",hotelDataAddedToDBRouter);
app.use("/api/categorydata", categoryDataAddedToDBRouter);

app.use("/api/hotels",hotelRouter);
app.use("/api/category", categoryRouter);
app.use("/api/hotels",singleHotelRouter);
app.use("/api/auth",authRouter);
app.use("/api/wishlist", wishlistRouter);


mongoose.connection.once("open",()=>{
    console.log("Connected to DB");
    app.listen(process.env.PORT || PORT,()=>{
        console.log("Server is Up and Running")
    })
})

