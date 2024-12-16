import dotenv from "dotenv";
dotenv.config({path: './.env'});

import {connectDB} from "./db/index.js" ;
import { app } from "./app.js";

connectDB()
.then(() => {
    const PORT = process.env.PORT || 1331 ; 

    app.on("error", (error) => {
        console.log("ERR: ", error);
        throw error ;
    })

    app.listen(PORT, () => {
        console.log(`Server is running at: ${PORT}`);
    })
})
.catch((err) => {
    console.log(`MongoDB Connection Failed!!!: `, err);
})











/*
import mongoose from "mongoose"
import { DB_NAME } from "./constants.js";

import express from "express";
const app = express();

(async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URL}/${DB_NAME}`
        );

        app.on("error", (error) => {
            console.log("Error", error);
            throw error;
        });

        app.listen(process.env.PORT, () => {
            console.log(`Running at: ${process.env.PORT}`);
        });

        console.log(connectionInstance);
    } catch (err) {
        console.log(err);
        throw err;
    }
})();
*/