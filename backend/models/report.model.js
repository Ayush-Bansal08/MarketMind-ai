import mongoose from "mongoose";
// so i will store everyreport here and if the user ask about a compan i would just give him this report
// i will only use this report if the report is new 
const reportSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },

  similarCompanies: [
    {
      name: String,
      score: Number   // similarity score (optional but 🔥 impressive)
    }
  ],

  trend: {
    type: String
  },

  explanation: {
    type: String,
    required: true
  },

}, { timestamps: true });

export default mongoose.model("Report", reportSchema);