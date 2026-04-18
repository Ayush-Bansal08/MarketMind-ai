import mongoose from 'mongoose';

// this stores the query asked by the user and the user id who asked that query

const querySchema = new mongoose.Schema({
    companyName: {
        type: String,
        trim: true,
        lowercase: true,
    },
    queryData : {
        type : String,
        required: true,
        trim: true,
    },
    UserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    aiResponse: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["success", "failed"],
        default: "success",
    },
    embeddings: {
        type: [Number],
        default: []
    }

},{timestamps: true});
export default mongoose.model("Query", querySchema);