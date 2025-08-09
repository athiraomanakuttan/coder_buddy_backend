import {ChatType, ParticipentsType} from '../../model/shared/chat.model'
interface ChatRepository{
    getChatList(id:string):Promise<ChatType[] | null>
    createConversation( chatId:string, senderId:string, receiverId:string, message:string):Promise<ChatType |null>
    createChat(participents:ParticipentsType[], postId: string):Promise<ChatType | null>
    getChatDetails(chatId:string):Promise<ChatType | null>
    getChatDataById(expertId:string,userId:string, postId: string):Promise<ChatType[] | null>
}

export default ChatRepository