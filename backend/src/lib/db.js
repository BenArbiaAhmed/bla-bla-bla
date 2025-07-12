import mongoose from "mongoose";

export const connectDB = async ()=> {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to database successfully: ${conn.connection.host}`);
    }
    catch(err){
        console.log("Error connecting database: " + err);
    }
}