import mongoose, { ObjectId, Schema, Document, Model } from "mongoose";
export interface MessageType{
    message:string,
    userType: string,
    dateAndTime:Date
}

interface ConcernDataType {
    _id?: string | ObjectId;
    title: string;
    description: string;
    role: string;
    concernMeetingId?: string;
    concernUserId?: string;
    video?: string;
    message ?:MessageType[]
    userId: string;
    status: number;
    createdAt?: Date,
    updatedAt?:Date
}

const concernSchema = new mongoose.Schema<ConcernDataType>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: String, required: true },
    role: { type: String, required: true, enum:["user","expert"] },
    concernMeetingId: { type: mongoose.Schema.Types.ObjectId, ref: "meeting" , default:null},
    concernUserId: { type: String, default:null },
    message:[{
        message:{type: String},
        userType:{type: String, enum:["user","admin","expert"]},
        dateAndTime:{type:Date, default:Date.now()}
    }],
    status: { type: Number, enum: [0, 1, 2], default: 0 },
    video:{ type: String, maxlength: 5000 }
},{timestamps: true});


const Concern = mongoose.model("concern",concernSchema)


export {ConcernDataType, Concern}