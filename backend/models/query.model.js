import mongoose from 'mongoose';

// this stores the query asked by the user and the user id who asked that query

const querySchema = new mongoose.Schema({
    queryData : {
        type : String
    },
    UserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }

},{timestamps: true});
export default mongoose.model("Query", querySchema);