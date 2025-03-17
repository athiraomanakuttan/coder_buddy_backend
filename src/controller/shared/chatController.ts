import {Request, Response } from "express"
import { ParticipentsType } from "../../model/shared/chat.model";
import IChatService from "../../services/shared/IChatService";
import IUserService from "../../services/user/IUserService";
import IExpertService from "../../services/expert/IExpertService";
import { STATUS_CODES } from "../../constants/statusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessage";
export interface CustomRequest extends Request {
    id?: string; 
  }
class ChatController {
    private chatService  : IChatService
    private userService : IUserService
    private expertService : IExpertService
    constructor(chatService : IChatService, userService: IUserService, expertService : IExpertService){
        this.chatService = chatService;
        this.userService = userService
        this.expertService = expertService
    }
    async getChatList(req:CustomRequest,res:Response):Promise<void>{
        const id = req.id;
        try {
            if(!id){
                res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:ERROR_MESSAGES.UNAUTHORIZED})
                return
            }
           const chatList = await this.chatService.getUserChatList(id);
           res.status(STATUS_CODES.OK).json({status:true,message:"chat list fetched successfully",data: chatList})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status:false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR})
        }
    }

    async newMessage(req:CustomRequest,res:Response):Promise<void>{
        const senderId = req.id
        if(!senderId){
            res.status(STATUS_CODES.BAD_REQUEST).json({status:false,message:ERROR_MESSAGES.UNAUTHORIZED})
            return
        }
         let { receiverId, message,chatId , postId } = req.body;
         try {
            if(!chatId){
                const userDetails = await this.userService.getUserById(senderId)
                const expertDetails = await this.expertService.getExpertById(receiverId)
                if(!userDetails){
                    res.status(STATUS_CODES.BAD_REQUEST).json({status:false,message:"user data is empty, unable to create new chat"})
                    return
                }
                if(!expertDetails){
                    res.status(STATUS_CODES.BAD_REQUEST).json({status:false,message:"expert data is empty, unable to create new chat"})
                    return
                }
                const participents= [
                    {
                        id: senderId,
                        role: 'user',
                        name: `${userDetails.first_name || ''} ${userDetails.last_name || ''}`.trim() || "User",
                        profile_pic: userDetails.profilePicture || 'https://res.cloudinary.com/dicelwy0k/image/upload/v1734162966/k1hkdcipfx9ywadit4lr.png'
                    },
                    {
                        id: receiverId,
                        role: 'expert',
                        name: `${expertDetails.first_name || ''} ${expertDetails.last_name || ''}`.trim() || "Expert",
                        profile_pic: expertDetails.profilePicture || 'https://res.cloudinary.com/dicelwy0k/image/upload/v1734162966/k1hkdcipfx9ywadit4lr.png'
                    }
                ] as ParticipentsType[]
                const newChat = await this.chatService.createNewChat(participents, postId)
                if(!newChat){
                    res.status(STATUS_CODES.BAD_REQUEST).json({status:false,messsage:"unable to create chat"})
                    return
                }
                chatId = newChat._id
            }
            const conversation =  await this.chatService.creatConversation(chatId,senderId,receiverId,message)
            res.status(STATUS_CODES.OK).json({status:true, message:"conversation created sucessfully", data: conversation})
         } catch (error){
            console.log("error while adding conversation",error)
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status:false,messsage:ERROR_MESSAGES.INTERNAL_SERVER_ERROR})
         }
    }

    async getChatMessage(req:CustomRequest,res:Response):Promise<void>{
        const {chatId} =  req.params
        try {
            if(!chatId){
                res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:ERROR_MESSAGES.INVALID_INPUT})
                return
            }
            const chatData = await this.chatService.getChatData(chatId)
            res.status(STATUS_CODES.OK).json({status:true, message:"data fetched sucessfully", data:chatData})
        } catch (error) {
                console.log(error)
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status:false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR})
        }
    }

    async createNewChat(req:CustomRequest, res:Response):Promise<void>{
        const senderId = req.id
        if(!senderId){
            res.status(STATUS_CODES.BAD_REQUEST).json({status:false,message:ERROR_MESSAGES.UNAUTHORIZED})
            return
        }
         let { expertId, postId } = req.body;
         try {
                const existChat =  await this.chatService.getChatById(expertId,senderId,postId)
                if(existChat && existChat.length){
                    res.status(STATUS_CODES.OK).json({status:true, message:"data fetched sucessfully", data:existChat})
                    return;
                }
                const userDetails = await this.userService.getUserById(senderId)
                const expertDetails = await this.expertService.getExpertById(expertId)
                if(!userDetails){
                    res.status(STATUS_CODES.BAD_REQUEST).json({status:false,message:"user data is empty, unable to create new chat"})
                    return
                }
                if(!expertDetails){
                    res.status(STATUS_CODES.BAD_REQUEST).json({status:false,message:"expert data is empty, unable to create new chat"})
                    return
                }
                const participents= [
                    {
                        id: senderId,
                        role: 'user',
                        name: `${userDetails.first_name || ''} ${userDetails.last_name || ''}`.trim() || "User",
                        profile_pic: userDetails.profilePicture || 'https://res.cloudinary.com/dicelwy0k/image/upload/v1734162966/k1hkdcipfx9ywadit4lr.png'
                    },
                    {
                        id: expertId,
                        role: 'expert',
                        name: `${expertDetails.first_name || ''} ${expertDetails.last_name || ''}`.trim() || "Expert",
                        profile_pic: expertDetails.profilePicture || 'https://res.cloudinary.com/dicelwy0k/image/upload/v1734162966/k1hkdcipfx9ywadit4lr.png'
                    }
                ] as ParticipentsType[]
                const newChat = await this.chatService.createNewChat(participents, postId)
                res.status(STATUS_CODES.OK).json({status:true,message:"data fetched sucessfully",data:newChat});
                if(!newChat){
                    res.status(STATUS_CODES.BAD_REQUEST).json({status:false,messsage:"unable to create chat"})
                    return
                }
            }
           catch(error){
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status:false,messsage:ERROR_MESSAGES.INTERNAL_SERVER_ERROR})
           }
    }

    
}

export default ChatController