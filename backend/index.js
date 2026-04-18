import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import queryRoutes from './routes/query.route.js';
import { detectTrends, detectTrendsOnEvent } from "./inngest/functions/detectTrends.js";
import { onUserSignup } from "./inngest/functions/onSignup.js";
import { inngest } from "./inngest/client.js";
import { serve } from "inngest/express";
dotenv.config({path: './.env'});

const rawPort = process.env.PORT || "3000";
const parsedPort = Number.parseInt(String(rawPort).trim(), 10);
const PORT = Number.isNaN(parsedPort) ? 3000 : parsedPort;
const app = express();

export const inngestRouter = serve({
  client: inngest,
  functions: [detectTrends, detectTrendsOnEvent, onUserSignup],
});


app.use(cors({
    origin: process.env.APP_URL,
  credentials: true
}));

app.use(express.json());
app.use("/auth/user",userRoutes)
app.use("/auth/query",queryRoutes)
app.use("/api/inngest", inngestRouter)
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




