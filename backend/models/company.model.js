import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    description : {
        type : String,
        required: true
    },
    embeddings : {
        type : [Number],
        Default : []
    },
    industry : {
        type : String
    },
    tage: {
        type : [String]
    }

},{timestamps: true});

export default mongoose.model("Company", companySchema);