import { Chat, ChatType, ParticipentsType } from "../../../model/shared/chat.model";
import { Conversation, ConversationType } from "../../../model/shared/message.model";
import IChatRepository from "../../shared/chatRepositories";
import { BaseRepository } from "../../base";

class ChatRepositoryImplimenation extends BaseRepository<ChatType> implements IChatRepository { 
    constructor() {
        super(Chat);
    }

    async getChatList(participentId: string): Promise<ChatType[] | null> {
        const chatData = await Chat.find({ 'participents.id': participentId })
            .populate("postId")
            .sort({ updatedAt: -1 })
        return chatData;
    }

    async createConversation(chatId: string, senderId: string, receiverId: string, message: string): Promise<ChatType | null> {
        const newConversation = await Conversation.create({
            senderId,
            receverId: receiverId,
            message,
            isRead: 0
        });
        const chat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { messages: newConversation._id },
                $set: { updatedAt: new Date() }
            }
        );
        return chat;
    }

    async createChat(participents: ParticipentsType[], postId: string): Promise<ChatType | null> {
        const newChat = new Chat({
            participents: participents,
            postId: postId,
            messages: []
        });
        const savedChat = await newChat.save();
        return savedChat;
    }

    async getChatDetails(chatId: string): Promise<ChatType | null> {
        const chatDetails = await Chat.findById({ _id: chatId }).populate('messages');
        if (!chatDetails) return null;
        return chatDetails;
    }

    async getChatDataById(expertId: string, userId: string, postId: string): Promise<ChatType[] | null> {
        const chatData = await Chat.find({
            'participents.id': {
                $all: [expertId, userId]
            }, postId: postId
        })
            .sort({ updatedAt: -1 })
        return chatData;
    }
}

export default ChatRepositoryImplimenation;