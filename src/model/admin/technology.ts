import mongoose, { Mongoose } from "mongoose";
interface TechnologyType{
    title ?: string,
    status ?:number
}
const TechSchema = new mongoose.Schema<TechnologyType>({
    title:{
        type: String,
        required: true,
        unique: true
    },
    status:{
        type:Number,
        enum:[0,1],
        default: 1
    }
},{timestamps: true})

const Technology = mongoose.model<TechnologyType>('technology',TechSchema)

export {Technology, TechnologyType}