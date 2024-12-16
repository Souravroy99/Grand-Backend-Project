import mongoose from "mongoose"
import {DB_NAME} from "../constants.js"


export const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

        console.log(`\n Mongodb Connected!! DB HOST: ${connectionInstance.connection.host}`)
    }
    catch(error) {
        console.log("Database connection error: ", error) ;
        process.exit(1) ;
    }
} 