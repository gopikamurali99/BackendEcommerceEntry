
import mongoose from "mongoose"
import 'dotenv/config';

 export const connectionString = async () => {
   try {
    await mongoose.connect(process.env.DB_URL)
    console.log('database connected successfully')
   } 
   catch (error) {
    console.log(error)
   }
   
}



