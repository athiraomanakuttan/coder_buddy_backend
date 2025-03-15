import UserService from "../../services/user/Implimentation/userServices";
import { Request, Response } from "express";
import { uploadImageToCloudinary } from "../../utils/uploadImageToCloudinary ";
import { STATUS_CODES } from "../../constants/statusCode";
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
        console.log(data)
        if (!data.userId) {
            res.status(401).json({ 
                status: false, 
                message: "Unauthorized user. Please login" 
            });
            return;
        }
        let uploadedFileUrl = data.uploads;
        if (file) {
            try {
                uploadedFileUrl = await uploadImageToCloudinary(file.buffer);
            } catch (uploadError) {
                res.status(500).json({ 
                    status: false, 
                    message: "Failed to upload image" 
                });
                return;
            }
        }
        const postData = {
            ...data,
            uploads: uploadedFileUrl
        };
        console.log("postdata",postData)
        const uploadPost = await this.postService.uploadPost(postData);
        if (uploadPost) {
            res.status(201).json({ 
                status: true, 
                message: "Post created successfully", 
                data: uploadPost 
            });
        } else {
            res.status(500).json({ 
                status: false, 
                message: "Failed to create post" 
            });
        }

    } catch (error) {
        console.error("Post creation error:", error);
        res.status(500).json({ 
            status: false, 
            message: "Unable to upload the post. Try again" 
        });
    }
}

async getPostDetails(req: CustomRequest, res: Response): Promise<void> {
    const userId = req.id ; 
    console.log("user details",userId)
    let { status, page = 1, limit = 5 } = req.body
    if (!userId) {
        res.status(400).json({ status: false, message: "User not authorized" })
        return;
    }
    
    try {
        const pageNumber = Number(page);
        const pageSize = Number(limit);
        const userDetails = await this.postService.getUserPost( userId, status, pageNumber,pageSize)
        console.log("userDetails",userDetails)
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
        console.log(error)
        res.status(400).json({ status: false, message: "Unable to fetch the details" })
    }
}
async updatePostStatus(req:CustomRequest, res: Response):Promise<void>{
    const userId = req.id;
    const {postId , status} = req.body
    if(!userId || !postId || !status){
        res.status(400).json({status: false , message:"unable to update the Post. Try again"})
        return
    }
    try {
        const postStatus = Number(status)
        const updateStatus =  await this.postService.updatePostStatus(userId,postId, postStatus)
        if(updateStatus){
            res.status(STATUS_CODES.OK).json({status: true, message:"post updated successfully"})
        }
    } catch (error) {
        console.log("error while updating post status", error)
        res.status(500).json({status:false, message:"error while updating post status"})
    }
}

async searchPost(req:CustomRequest , res:Response):Promise<void>{
    const userId = req.id ; 
    let page = 1, limit = 5;
    let { status, search } = req.params

    if (!userId) {
        res.status(400).json({ status: false, message: "User not authorized" })
        return;
    }
    
    try {
        const pageNumber = Number(page);
        const pageSize = Number(limit);
        const userDetails = await this.postService.getUserPost( userId, status, pageNumber,pageSize ,search)
        console.log("userDetails",userDetails)
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
        console.log(error)
        res.status(400).json({ status: false, message: "Unable to fetch the details" })
    }
}


async updatePost(req: CustomRequest, res:Response):Promise<void>{
    const {comments,uploads,...data}  = req.body
    const file = req.file;
        if (!data._id) {
            res.status(403).json({ 
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
                res.status(500).json({ 
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
            

            console.log("uploadedFileUrlwww", data)

       try {
        const updatedData =  await this.postService.updatePostDetails(data._id, postData)
        if(updatedData)
         res.status(STATUS_CODES.OK).json({status: true, message:"post updated"})
       } catch (error) {
        res.status(500).json({status: false, message:"unable to update post"})
        
       }
}

async getPostReport(req:CustomRequest,res: Response):Promise<void>{
    const userId  = req.id
    if(!userId){
      res.status(401).json({status:false, message:"unautherized user"})
      return
    }
    try {
      const postReport  = await this.postService.getUserPostReport(userId)
      if(postReport){
        res.status(STATUS_CODES.OK).json({status: true, message:"fetched data sucessfully", data:postReport})
      }
    } catch (error) {
      console.log("error while ftching report", error)
      res.status(500).json({status:false, message:"error while fetching data"})
    }
  }



}
export default  PostController