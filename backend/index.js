import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config({path: './.env'});

const PORT = process.env.PORT;
const app = express();


app.use(cors({
    origin: process.env.APP_URL,
    Credentials: true
}));

app.use(express.json());

// connect to the database

mongoose.connect(process.env.MONGO_URI)
  .then(()=>{
    console.log("Connected to MongoDB backend successfully");
    app.listen(PORT, ()=>{
    console.log(`Backend server connected to the port ${PORT} successfully`);
    })
  })
.catch((error)=>{
    console.error("Error connecting to MongoDB backend:", error);
  });



