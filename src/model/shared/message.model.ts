import  mongoose  from "mongoose";

interface ConversationType extends Document {
  senderId :  string,
  receverId : string,
  message :  string,
  isRead ? : number
}

const conversationSchema =  new mongoose.Schema({
  senderId : {
    type: mongoose.Schema.Types.ObjectId,
    required :  true
  },
  receverId : {
    type: mongoose.Schema.Types.ObjectId,
    required :  true
  },
  message:{
    type :  String,
    required: true
  },
  isRead : {
    type: Number,
    enum : [0,1],
    default : 0
  }
},{timestamps:true})


const Conversation = mongoose.model('message', conversationSchema);
export { Conversation , ConversationType}