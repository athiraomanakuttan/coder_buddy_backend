import { ChatListResponse, ChatType, ParticipentsType } from "../../model/shared/chat.model"

interface IChatService {
    getUserChatList(id: string): Promise<ChatType[] | null>
    createNewChat(participents:ParticipentsType[], postId: string):Promise<ChatType | null>
    creatConversation(chatId: string, senderId: string, receiverId: string, message: string):Promise<ChatType | null>
    getChatData(chatId:string):Promise<ChatType | null>
    getChatById(expertId:string,userId:string,postId: string):Promise<ChatType[] | null>
}

export default IChatService