import { Response, Request } from "express";
import ExpertService from "../../services/expert/Implimentation/expertServices";
import { CommentType } from "../../model/user/postModel";
import IExpertService from "../../services/expert/IExpertService";

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
      res.status(400).json({ success: false, message: 'User is not autherized' });
        return
      }
    const expertDetails = await this.postService.getExpertById(id)
    if(!expertDetails){
        res.status(400).json({ success: false, message: 'User is not autherized' });
        return
    }
      const posts = await this.postService.fetchPosts(Number(page), Number(limit) , expertDetails.skills ?expertDetails.skills : null );
      const totalPost = await this.postService.getPostCount({status:0,technologies: { $in: expertDetails.skills }})
      const pageCount = Math.ceil(totalPost / Number(limit))
        if(posts){
            res.status(200).json({ success: true, message :"post data fetched successfully",data: posts, pagination:{currentPage:page,totalPages:pageCount} });
            return
        }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching posts' });
    }
  }

  async addComment(req: CustomRequest , res: Response):Promise<void>{
    const data = req.body
    const id = req.id;
    if(!id || !data.postId){
      res.status(400).json({status :  false, message : "user is not autherized."})
      return
    }
    

    const commentData = {comment: data.comment, expertId: id }  as CommentType
    try {
        const comment  =  await this.postService.addComment(data.postId , commentData)
        if(comment){
          res.status(200).json({status: true ,message:"Comment added" })
          return;
        }
        res.status(400).json({status:false, message:"unable to add comment"})
          
    } catch (error) {
      res.status(500).json({status :  false, message : "unable to add comment. Try again"})
      
    }
  }

  async deleteComment(req: Request, res:Response):Promise<void>{
    const {commentId , expertId ,  postId} = req.body
    if(!commentId || !expertId || !postId){
      res.status(400).json({status: false ,  message : "unable to delete comment"})
      return
    }
    try {
      const commentDelete = await this.postService.commentDelete(commentId,expertId,postId)
      if(commentDelete){
      res.status(200).json({status: true ,  message : "comment removed sucessfully"})
        return
      }
      res.status(400).json({status: false ,  message : "unable to delete comment"})

    } catch (error) {
      res.status(500).json({status: false ,  message : "unable to delete comment"})
      
    }
  }
}

export default PostController;
