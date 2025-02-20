import { ChatListResponse, ChatType, ParticipentsType } from "../../../model/shared/chat.model"
import { ConversationType } from "../../../model/shared/message.model"
import { PostType } from "../../../model/user/postModel"
import ChatRepository from "../../../repositories/shared/chatRepositories"
import IChatService from "../IChatService"

class ChatService implements IChatService{
    private chatRepository: ChatRepository
    constructor(chatRepository:ChatRepository){
        this.chatRepository = chatRepository
    }
 
    async getUserChatList(id: string): Promise<ChatType[] | null> {
        const chatList = await this.chatRepository.getChatList(id);
        return chatList;
    }
    
    async createNewChat(participents:ParticipentsType[], postId:string):Promise<ChatType | null>{
       const newChat =  await this.chatRepository.createChat(participents, postId)
       return newChat
    }

    async creatConversation(chatId: string, senderId: string, receiverId: string, message: string):Promise<ChatType | null>{
        const newConversation  = await this.chatRepository.createConversation(chatId,senderId,receiverId,message)
        return newConversation;
    }

    async getChatData(chatId:string):Promise<ChatType | null>{
        const chatDetails = await this.chatRepository.getChatDetails(chatId)
        return chatDetails;
    }
    async getChatById(expertId:string,userId:string,postId: string):Promise<ChatType[] | null>{
        const chatData =  await this.chatRepository.getChatDataById(expertId,userId,postId);
        return chatData
    }
    
}

export default ChatService