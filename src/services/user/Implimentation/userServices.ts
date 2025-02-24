import UserRepository from "../../../repositories/user/userRepository";
import { UserType } from "../../../model/user/userModel";
import { PostType } from "../../../model/user/postModel";
import { ExpertDocument } from "../../../model/expert/expertModel";
import IUserService from "../IUserService";
import { MeetingCountType, MonthlyUserPostReportType, PostCountType } from "../../../types/type";
import { TechnologyType } from "../../../model/admin/technology";

class UserService implements IUserService{
    private userRepository:UserRepository;
    constructor(userRepository:UserRepository)
    {
        this.userRepository = userRepository;
    }
    
    async createUser(user: UserType):Promise<UserType>{
        const newUser = await this.userRepository.createUser(user)
        return newUser;
    }
    
    async findByEmail(email:String):Promise<UserType | null>
    {
       
        const getUser = await this.userRepository.findByEmail(email)
        return getUser
    }
    async updateUser(email: string, data: UserType): Promise<UserType | null> {
        const updatedUser = await this.userRepository.updateUserByEmail(email, data);
        return updatedUser;
    }
    
    async getUserByEmail(email: string): Promise<UserType | null> {
        return await this.userRepository.getUserByEmail(email);
    }
    async updateUserById(id: string ,  data: UserType): Promise<UserType |string | null >{
        const updatedUser =  await this.userRepository.updateById(id,data)
        return updatedUser
    }
    async getUserById(id :  string):Promise<UserType | null>{
        const user =  await this.userRepository.findById(id)
        return user
    }
    async uploadPost(data:PostType):Promise<PostType | null>{
        const uploadPost =  await this.userRepository.uploadPost(data)
        return uploadPost
    }
    async getUserPost(id: string,status: string | null,  page: number = 1, limit: number = 5, search=""): Promise<{
        posts: PostType[] | null;
        totalPosts: number;
        totalPages: number;
    } | null> {
        const skip = (page - 1) * limit;
    
        const postDetails = await this.userRepository.getPostDetails(
            id, 
            status, 
            skip, 
            limit,
            search
        )
        if (postDetails) {
            return postDetails
        }
        return null;
    }

    async updatePostStatus(userId : string, postId:string,status:number):Promise<PostType | null>{
        const updateStatus = await this.userRepository.updatePostStatus(userId , postId,status)
        return updateStatus
    }

    async getExpertById(id: string):Promise<ExpertDocument | null >{
        const data = await this.userRepository.findExpertById(id)
        return data;
    }

    async updatePostDetails(postId: string, postData: PostType): Promise<PostType | null> {
        const data =  await this.userRepository.updatePostData(postId, postData)
        return data;
    }

    async getUserPostReport(userId: string): Promise<MonthlyUserPostReportType[] | null> {
        const data = await this.userRepository.getPostReport(userId)
        return data
    }

    async getPostCount(userId: string): Promise<PostCountType | null> {
        const data = await this.userRepository.getPostCount(userId)
        return data
    }

    async getMeetingDetails(userId: string): Promise<MeetingCountType | null> {
        const data  =  await this.userRepository.getMeetingDetails(userId)
        return data
    }

    async getAllTechnologies(): Promise<TechnologyType[] | null> {
        return this.userRepository.getAllTechnologies()
    }
}

export default UserService;