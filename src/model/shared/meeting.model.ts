import mongoose from 'mongoose'
import { RatingData } from '../../types/type';

interface MeetingUserType {
    _id: string;
    title: string;
    meetingDate: Date;
    expertId: string;
    userId: string;
    postId: mongoose.Types.ObjectId;
    status: number;
    rating ?:RatingData[],
    createdAt: Date;
    updatedAt: Date;
}

const meetingSchema = new mongoose.Schema<MeetingUserType>({
    title: {
        type: String,
        required: true
    },
    meetingDate: {
        type: Date,
        required: true
    },
    expertId: {
        type: String,
        required: true,
        ref: 'expert'
    },
    userId: {
        type: String,
        required: true,
        ref: 'user'
    },
    postId:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"post",
        required:true
    },
    rating:[{
        userId:{ type: String, required: true},
        meetingRating:{ type: Number},
        participantBehavior:{type: Number  },
        feedback : {type: String }
    }],
    status: {
        type: Number,
        default: 0,
        enum: [0, 1]
    }
}, { 
    timestamps: true 
});

const MeetingUser = mongoose.model<MeetingUserType>('meeting', meetingSchema);

export { MeetingUser, MeetingUserType}