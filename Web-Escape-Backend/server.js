import express from "express";
const app= express();
import dotenv from "dotenv";
dotenv.config({});

import cookieParser from "cookie-parser";

import cors from "cors";
import connectDb from "./utils/database.js";
import authRoutes from "./routes/authRoutes.js";

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.get("/home",(req,res)=>{
    res.send("i am coming from backend");
});

const corsOption={
    origin:"http://localhost:5173",
    credentials:true,
}

app.use(cors(corsOption));

app.use("/api/v1/user", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    connectDb();
    console.log("app is listening on port 3000");
});

