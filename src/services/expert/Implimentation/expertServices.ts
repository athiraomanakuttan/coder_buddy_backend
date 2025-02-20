import { ExpertDocument } from "../../../model/expert/expertModel";
import { CommentType, PostType } from "../../../model/user/postModel";
import ExpertRepository from "../../../repositories/expert/expertRepository";
import { MonthlyAdminProfitReport } from "../../../types/type";
import IExpertService from "../IExpertService";

class ExpertService implements IExpertService {
    private expertRepository: ExpertRepository;

    constructor(expertRepository: ExpertRepository) {
        this.expertRepository = expertRepository;
    }

    async createExpert(data: ExpertDocument): Promise<ExpertDocument | null> {
            const newExpert = await this.expertRepository.createExpert(data);
            return newExpert;
    }
    async getExpertByEmail(email:string):Promise<ExpertDocument | null>{
            const expertData = await this.expertRepository.getExpertByEmail(email);
            return expertData
    }
    async getExpertById(id:string):Promise<ExpertDocument | null>{
            const expertData =  await this.expertRepository.getExpertById(id)
            return expertData
    }
    async updateExpert(id:string , data : ExpertDocument):Promise<ExpertDocument | null>{
        return  await this.expertRepository.updateExpert(id,data)
    }
    async fetchPosts(page : number = 1, limit: number = 5, skillSet : string[] | null):Promise<PostType[] | null>{
        const skip = (page - 1) * limit
        
        const postData = await this.expertRepository.getPostData(skip,limit,skillSet)
        return postData
    }
    async getPostCount(condition:object):Promise<number>{
        const count = await this.expertRepository.getPostCount(condition)
        return count
    }

    async addComment(id: string, data : CommentType):Promise<PostType | null >{
        const newComment = await this.expertRepository.addComment(id,data)
        return newComment
    }

    async commentDelete(commentId: string, expertId: string, postId : string):Promise<PostType | null>{
        const updatePost = await this.expertRepository.deleteComment(commentId,expertId,postId)
        return updatePost
    }
    
}

export default ExpertService;
