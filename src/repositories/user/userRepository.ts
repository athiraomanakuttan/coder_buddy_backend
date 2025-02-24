import { TechnologyType } from "../../model/admin/technology";
import { ExpertDocument } from "../../model/expert/expertModel";
import { PostType } from "../../model/user/postModel";
import { UserType } from "../../model/user/userModel";
import { MeetingCountType, MonthlyUserPostReportType, PostCountType } from "../../types/type";
interface UserRepository {
    createUser(user:UserType):Promise<UserType>;
    findById(id:String):Promise<UserType | null>;
    findByEmail(email:String):Promise<UserType | null>;
    updateById(id:string,user:UserType):Promise<UserType | string | null>
    updateUserByEmail(email:string,data: UserType):Promise<UserType | null>
    getUserByEmail(email:string):Promise<UserType |null>
    uploadPost(data: PostType):Promise<PostType | null>
    getPostDetails(id: string, status: string | null,  page?: number, 
        limit?: number,
        searchQuery ?: string
    ): Promise<{
        posts: PostType[] | null;
        totalPosts: number;
        totalPages: number;
    } | null>
    countPosts(id:string,status:string  | null):Promise<number>
    updatePostStatus(userId :  string, id:string, status:number):Promise<PostType | null>
    findExpertById(id:string):Promise<ExpertDocument | null >
    updatePostData(postId: string, postData:PostType):Promise<PostType | null>
    getPostReport(userId: string):Promise<MonthlyUserPostReportType[] | null>
    getPostCount(userId: string):Promise<PostCountType | null>
    getMeetingDetails(userId: string):Promise<MeetingCountType | null>
    getAllTechnologies():Promise<TechnologyType[] | null>
}

export default UserRepository;