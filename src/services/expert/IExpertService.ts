import { ExpertDocument } from "../../model/expert/expertModel"
import { CommentType, PostType } from "../../model/user/postModel"
import { MonthlyAdminProfitReport } from "../../types/type"

interface IExpertService {
createExpert(data: ExpertDocument): Promise<ExpertDocument | null>
getExpertByEmail(email:string):Promise<ExpertDocument | null>
getExpertById(expertId:string):Promise<ExpertDocument | null>
updateExpert(expertId:string , data : ExpertDocument):Promise<ExpertDocument | null>
fetchPosts(page : number, limit: number, skillSet : string[] | null):Promise<PostType[] | null>
getPostCount(condition:object):Promise<number>
addComment(postId: string, data : CommentType):Promise<PostType | null >
commentDelete(commentId: string, expertId: string, postId : string):Promise<PostType | null>
}

export default IExpertService