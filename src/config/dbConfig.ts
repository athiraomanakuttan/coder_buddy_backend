import mongoose from 'mongoose'
import dotenv  from 'dotenv'
dotenv.config()

const connectDb = async ()=>{
    
    const connection_string = process.env.DB_CONNECTION_STRING
    
    try {
        const connection = await mongoose.connect(`${connection_string}`,{
            dbName:'coderbuddy'
        });
        console.log("db connected successfully")
    } catch (error) {
        console.log("eroor connecting db",error)
    }
}
export default connectDb;
