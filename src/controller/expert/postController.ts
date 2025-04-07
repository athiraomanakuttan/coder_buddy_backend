import { Response, Request } from "express";
import ExpertService from "../../services/expert/Implimentation/expertServices";
import { CommentType } from "../../model/user/postModel";
import IExpertService from "../../services/expert/IExpertService";
import { STATUS_CODES } from "../../constants/statusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessage";
import { CustomResponse } from "../../utils/customResponse";
import { SUCESS_MESSAGE } from "../../constants/sucessMessage";

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
      res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message: ERROR_MESSAGES.UNAUTHORIZED }  as  CustomResponse<null>);
        return
      }
    const expertDetails = await this.postService.getExpertById(id)
    if(!expertDetails){
        res.status(STATUS_CODES.BAD_REQUEST).json({ status: false, message:  ERROR_MESSAGES.UNAUTHORIZED }as CustomResponse<null>);
        return
    }
      const posts = await this.postService.fetchPosts(Number(page), Number(limit) , expertDetails.skills ?expertDetails.skills : null );
      const totalPost = await this.postService.getPostCount({status:0,technologies: { $in: expertDetails.skills }})
      const pageCount = Math.ceil(totalPost / Number(limit))
        if(posts){
            res.status(STATUS_CODES.OK).json({ status: true, message :SUCESS_MESSAGE.DATA_FETCH_SUCESS,data: posts, pagination:{currentPage:page,totalPages:pageCount} });
            return
        }
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ status: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as CustomResponse<null>);
    }
  }

  async addComment(req: CustomRequest , res: Response):Promise<void>{
    const data = req.body
    const id = req.id;
    if(!id || !data.postId){
      res.status(STATUS_CODES.BAD_REQUEST).json({status :  false, message : ERROR_MESSAGES.UNAUTHORIZED} as CustomResponse<null>)
      return
    }
    

    const commentData = {comment: data.comment, expertId: id }  as CommentType
    try {
        const comment  =  await this.postService.addComment(data.postId , commentData)
        if(comment){
          res.status(STATUS_CODES.OK).json({status: true ,message: SUCESS_MESSAGE.CREATION_SUCESS } as CustomResponse<null>)
          return;
        }
        res.status(STATUS_CODES.BAD_REQUEST).json({status:false, message:ERROR_MESSAGES.UNABLE_TO_CREATE})
          
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status :  false, message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as CustomResponse<null>)
      
    }
  }

  async deleteComment(req: Request, res:Response):Promise<void>{
    const {commentId , expertId ,  postId} = req.body
    if(!commentId || !expertId || !postId){
      res.status(STATUS_CODES.BAD_REQUEST).json({status: false ,  message : ERROR_MESSAGES.INVALID_INPUT} as CustomResponse<null>)
      return
    }
    try {
      const commentDelete = await this.postService.commentDelete(commentId,expertId,postId)
      if(commentDelete){
      res.status(STATUS_CODES.OK).json({status: true ,  message : SUCESS_MESSAGE.SUCESS_DELETION})
        return
      }
      res.status(STATUS_CODES.BAD_REQUEST).json({status: false ,  message : ERROR_MESSAGES.FAILED_DELETION})

    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({status: false ,  message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR} as CustomResponse<null>)
      
    }
  }
}

export default PostController;
