import mongoose from "mongoose";
import dotenv from 'dotenv'
import path from 'path';

dotenv.config({path: path.resolve('src/.env')})

export async function connectToDb() {

    try {
        await mongoose.connect(process.env.DATABASE_URL as string);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(`Error connecting to database`, error)        
    }
}
