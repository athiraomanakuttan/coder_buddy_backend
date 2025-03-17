import { ExpertDocument } from "../../model/expert/expertModel";
import { PostType, CommentType } from "../../model/user/postModel";

interface IExpertRepository{
    createExpert(data:ExpertDocument):Promise<ExpertDocument | null>;
    getExpertByEmail(email:string):Promise<ExpertDocument | null>;
    getExpertById(id:string):Promise<ExpertDocument | null>
    updateExpertByEmail(email:string, data:ExpertDocument):Promise<ExpertDocument | null>
    updateExpert(id:string,data:ExpertDocument):Promise<ExpertDocument | null>
    getPostData(page: number, limit: number, skillSet: string[] | null): Promise<PostType[] | null>
    getPostCount(condition:object):Promise<number >
    addComment(id:string, data: CommentType):Promise<PostType | null>
    deleteComment(commentId: string, expertId: string, postId : string):Promise<PostType | null>
}
export default IExpertRepository;