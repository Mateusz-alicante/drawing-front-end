import mongoose from "mongoose";

const connectMongo = async () => mongoose.connect(process.env.MONGOURL);

export default connectMongo;
