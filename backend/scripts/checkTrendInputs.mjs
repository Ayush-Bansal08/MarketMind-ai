import dotenv from "dotenv";
import mongoose from "mongoose";
import Query from "../models/query.model.js";

dotenv.config({ path: "./.env" });
await mongoose.connect(process.env.MONGO_URI);

const total = await Query.countDocuments();
const withEmb = await Query.countDocuments({ embeddings: { $exists: true, $ne: [] } });
const success = await Query.countDocuments({ status: "success" });
const latest = await Query.findOne().sort({ createdAt: -1 }).select("queryData status embeddings createdAt").lean();

console.log("QUERY_TOTAL=" + total);
console.log("QUERY_WITH_EMB=" + withEmb);
console.log("QUERY_SUCCESS=" + success);
console.log(
  "LATEST=" +
    JSON.stringify({
      status: latest?.status,
      embLen: latest?.embeddings?.length || 0,
      createdAt: latest?.createdAt,
      query: latest?.queryData,
    })
);

await mongoose.disconnect();
