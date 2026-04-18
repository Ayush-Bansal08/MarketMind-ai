import mongoose from "mongoose";

const trendSchema = new mongoose.Schema({
  trends: Array,
  totalQueries: Number,
  },
{timestamps: true});

export default mongoose.model("Trend", trendSchema);