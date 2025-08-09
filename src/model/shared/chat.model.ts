import mongoose, { Document, Schema, model } from "mongoose";
import { PostType } from "../user/postModel";

// Participant definition
export type ParticipentsType = {
  id: string;
  role: string;
  name: string;
  profile_pic: string;
};

// 1. Schema shape (just the fields)
export interface ChatSchemaType {
  participents: ParticipentsType[];
  postId: mongoose.Types.ObjectId | string;
  messages: mongoose.Types.ObjectId[] | string[];
}

// 2. Full document type used in the model (includes createdAt/updatedAt from timestamps)
 interface ChatType extends ChatSchemaType, Document {
  createdAt: Date;
  updatedAt: Date;
}

// 3. Schema definition
const chatSchema = new Schema<ChatType>(
  {
    participents: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        role: { type: String, required: true },
        name: { type: String, required: true },
        profile_pic: { type: String, required: true },
      },
    ],
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "message",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// 4. Model definition
const Chat = model<ChatType>("chats", chatSchema);

export { Chat, ChatType };
