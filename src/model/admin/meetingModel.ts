import mongoose, { Schema, Document } from "mongoose";


export interface MeetingType extends Document {
    _id : string | String,
    meetingId :  string,
    title: string,
    userId :  string,
    dateTime :  Date,
    status ?:  number
}

const meetingSchema = new Schema({
    meetingId : {
        type: String,
        required :  true,
        unique: true
    },
    title:{
        type: String,
        required: true
    },
    userId : {
        type: String,
        required: true
    },
    dateTime : {
        type :  Date,
        required: true
    },
    status:{
        type: Number,
        default: 0,
        enum : [0,1]
    }
},{timestamps: true})


const Meeting = mongoose.model<MeetingType>('expertmeeting', meetingSchema)

export default Meeting 