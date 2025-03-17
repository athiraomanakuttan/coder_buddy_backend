import { Response, Request } from "express";
import ExpertService from "../../services/expert/Implimentation/expertServices";
import { CommentType } from "../../model/user/postModel";
import IExpertService from "../../services/expert/IExpertService";
import { STATUS_CODES } from "../../constants/statusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessage";

export interface CustomRequest extends Request {
    id ?: string;  
}


class PostController {
  private postService: IExpertService;

  constructor(postService: IExpertService) {
    this.postService = postService;
  }

  async getPost(req: CustomRequest, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;
      const id = req.id
      if(!id){
      res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: ERROR_MESSAGES.UNAUTHORIZED });
        return
      }
    const expertDetails = await this.postService.getExpertById(id)
    if(!expertDetails){
        res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message:  ERROR_MESSAGES.UNAUTHORIZED });
        return
    }
      const posts = await this.postService.fetchPosts(Number(page), Number(limit) , expertDetails.skills ?expertDetails.skills : null );
      const totalPost = await this.postService.getPostCount({status:0,technologies: { $in: expertDetails.skills }})
      const pageCount = Math.ceil(totalPost / Number(limit))
        if(posts){
            res.status(STATUS_CODES.OK).json({ success: true, message :"post data fetched successfully",data: posts, pagination:{currentPage:page,totalPages:pageCount} });
            return
        }
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR});
    }
  }

  async addComment(req: CustomRequest , res: Response):Promise<void>{
    const data = req.body
    const id = req.id;
    if(!id || !data.postId){
      res.status(STATUS_CODES.BAD_REQUEST).json({status :  false, message : ERROR_MESSAGES.UNAUTHORIZED})
      return
    }
    

    const commentData = {comment: data.comment, expertId: id }  as CommentType
    try {
        const comment  =  await this.postService.addComment(data.postId , commentData)
        if(comment){
          res.status(STATUS_CODES.OK).json({status: true ,message:"Comment added" })
          return;
        }
        res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:"unable to add comment"})
          
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status :  false, message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR})
      
    }
  }

  async deleteComment(req: Request, res:Response):Promise<void>{
    const {commentId , expertId ,  postId} = req.body
    if(!commentId || !expertId || !postId){
      res.status(STATUS_CODES.BAD_REQUEST).json({status: false ,  message : ERROR_MESSAGES.INVALID_INPUT})
      return
    }
    try {
      const commentDelete = await this.postService.commentDelete(commentId,expertId,postId)
      if(commentDelete){
      res.status(STATUS_CODES.OK).json({status: true ,  message : "comment removed sucessfully"})
        return
      }
      res.status(STATUS_CODES.BAD_REQUEST).json({status: false ,  message : "unable to delete comment"})

    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false ,  message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR})
      
    }
  }
}

export default PostController;
