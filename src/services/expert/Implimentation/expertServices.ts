import { ExpertDocument } from "../../../model/expert/expertModel";
import { CommentType, PostType } from "../../../model/user/postModel";
import IExpertRepository from "../../../repositories/expert/expertRepository";
import IExpertService from "../IExpertService";

class ExpertService implements IExpertService {
    private expertRepository: IExpertRepository;

    constructor(expertRepository: IExpertRepository) {
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
    async getExpertById(expertId:string):Promise<ExpertDocument | null>{
            const expertData =  await this.expertRepository.getExpertById(expertId)
            return expertData
    }
    async updateExpert(expertId:string , data : ExpertDocument):Promise<ExpertDocument | null>{
        return  await this.expertRepository.updateExpert(expertId,data)
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

    async addComment(postId: string, data : CommentType):Promise<PostType | null >{
        const newComment = await this.expertRepository.addComment(postId,data)
        return newComment
    }

    async commentDelete(commentId: string, expertId: string, postId : string):Promise<PostType | null>{
        const updatePost = await this.expertRepository.deleteComment(commentId,expertId,postId)
        return updatePost
    }
    
}

export default ExpertService;
