import { Schema, Document, model } from 'mongoose'

interface PostType extends Document{
    title:string,
    userId : string,
    description :string,
    technologies :string[],
    uploads ?: string,
    comments: CommentType[],
    status : number
}
type CommentType={
    expertId:string,
    comment:string,
    status: number,
    date : Date
}


const postSchema =  new Schema<PostType>({
title : {
    type : String,
    required: true,
    message:"title is required"
},
description  :{
    type: String,
    required: true,
    message: " description is required"
},
userId:{
    type: String,
    required: true,
},
technologies:{
    type: [String],
    required: true
},
uploads:{
    type : String
},
comments : [{
    expertId:{
        type : String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    status : {
        type: Number,
        required : true,
        enum : [0,1],
        default: 1
    },
    date:{
        type: Date,
        default: Date.now()
    }
}],
status :{
    type : Number,
    required: true,
    enum:[0,1,2],
    default : 1
}
})

const Post = model<PostType>('post', postSchema) 
export { Post , PostType}