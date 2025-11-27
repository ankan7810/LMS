import mongoose from "mongoose";
// const dotenv = require('dotenv'); 
import dotenv from "dotenv"
dotenv.config()

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    console.log("MongoDB connected");
    
    // await mongoose.connect(process.env.MONGO_URI)
    // .then(()=>console.log("Mongodb connected successfully"));
  } catch (error) {
    console.log(error);
  }
};
export default connectDB;
