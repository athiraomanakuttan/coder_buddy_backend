import UserService from "../../services/user/Implimentation/userServices";
import { Request, Response } from "express";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary ";
import { STATUS_CODES } from "../../constants/statusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessage";
import { CustomResponse } from "../../utils/customResponse";
import { PostType } from "../../model/user/postModel";
export interface CustomRequest extends Request {
    id?: string; 
  }

class PostController{
    private postService : UserService;
    constructor(postService :UserService ){
        this.postService = postService;
    }

   async createPost(req: Request, res: Response): Promise<void> {
    try {
        const data = req.body;
        const file = req.file;
        if (!data.userId) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ 
                status: false, 
                message: ERROR_MESSAGES.UNAUTHORIZED
            }  as CustomResponse<null>);
            return;
        }
        let uploadedFileUrl = data.uploads;
        if (file) {
            try {
                uploadedFileUrl = await uploadImageToCloudinary(file.buffer);
            } catch (uploadError) {
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
                    status: false, 
                    message: "Failed to upload image" 
                }  as CustomResponse<null>);
                return;
            }
        }
        const postData = {
            ...data,
            uploads: uploadedFileUrl
        };
        const uploadPost = await this.postService.uploadPost(postData);
        if (uploadPost) {
            res.status(STATUS_CODES.CREATED).json({ 
                status: true, 
                message: "Post created successfully", 
                data: uploadPost 
            }  as CustomResponse<PostType> );
        } else {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
                status: false, 
                message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR 
            } as CustomResponse<null>);
        }

    } catch (error) {
        console.error("Post creation error:", error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
            status: false, 
            message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        } as CustomResponse<null> );
    }
}

async getPostDetails(req: CustomRequest, res: Response): Promise<void> {
    const userId = req.id ; 
    let { status, page = 1, limit = 5 } = req.body
    if (!userId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.UNAUTHORIZED } as CustomResponse<null>)
        return;
    }
    
    try {
        const pageNumber = Number(page);
        const pageSize = Number(limit);
        const userDetails = await this.postService.getUserPost( userId, status, pageNumber,pageSize)
        if (userDetails) {
            res.status(STATUS_CODES.OK).json({
                status: true, 
                message: "Data fetched successfully", 
                data: userDetails.posts,
                pagination: {
                    currentPage: pageNumber,
                    totalPages: userDetails.totalPages,
                    totalPosts: userDetails.totalPosts
                }
            })
        }
    } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR } as CustomResponse<null>)
    }
}
async updatePostStatus(req:CustomRequest, res: Response):Promise<void>{
    const userId = req.id;
    const {postId , status} = req.body
    if(!userId || !postId || !status){
        res.status(STATUS_CODES.BAD_REQUEST).json({status: false , message:ERROR_MESSAGES.UPDATION_FAILED} as CustomResponse<null>)
        return
    }
    try {
        const postStatus = Number(status)
        const updateStatus =  await this.postService.updatePostStatus(userId,postId, postStatus)
        if(updateStatus){
            res.status(STATUS_CODES.OK).json({status: true, message:"post updated successfully"} as CustomResponse<null>)
        }
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status:false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as CustomResponse<null>)
    }
}

async searchPost(req:CustomRequest , res:Response):Promise<void>{
    const userId = req.id ; 
    let page = 1, limit = 5;
    let { status, search } = req.params

    if (!userId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.UNAUTHORIZED } as CustomResponse<null>)
        return;
    }
    
    try {
        const pageNumber = Number(page);
        const pageSize = Number(limit);
        const userDetails = await this.postService.getUserPost( userId, status, pageNumber,pageSize ,search)
        if (userDetails) {
            res.status(STATUS_CODES.OK).json({
                status: true, 
                message: "Data fetched successfully", 
                data: userDetails.posts,
                pagination: {
                    currentPage: pageNumber,
                    totalPages: userDetails.totalPages,
                    totalPosts: userDetails.totalPosts
                }
            })
        }
    } catch (error) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as CustomResponse<null>)
    }
}


async updatePost(req: CustomRequest, res:Response):Promise<void>{
    const {comments,uploads,...data}  = req.body
    const file = req.file;
        if (!data._id) {
            res.status(STATUS_CODES.FORBIDDEN).json({ 
                status: false, 
                message: "post Id is empty" 
            });
            return;
        }
        let uploadedFileUrl = data.uploads;
        if (file) {
            try {
                uploadedFileUrl = await uploadImageToCloudinary(file.buffer);
            } catch (uploadError) {
                res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ 
                    status: false, 
                    message: "Failed to upload image" 
                });
                return;
            }
        }
        let postData = {
            ...data
        };
        if(file){
            postData = {
                ...data,
                uploads: uploadedFileUrl
            };
        }
            
       try {
        const updatedData =  await this.postService.updatePostDetails(data._id, postData)
        if(updatedData)
         res.status(STATUS_CODES.OK).json({status: true, message:"post updated"})
       } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR})
        
       }
}

async getPostReport(req:CustomRequest,res: Response):Promise<void>{
    const userId  = req.id
    if(!userId){
      res.status(STATUS_CODES.UNAUTHORIZED).json({status:false, message:ERROR_MESSAGES.UNAUTHORIZED})
      return
    }
    try {
      const postReport  = await this.postService.getUserPostReport(userId)
      if(postReport){
        res.status(STATUS_CODES.OK).json({status: true, message:"fetched data sucessfully", data:postReport})
      }
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status:false, message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR})
    }
  }



}
export default  PostController