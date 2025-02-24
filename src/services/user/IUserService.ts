import { TechnologyType } from "../../model/admin/technology"
import { ExpertDocument } from "../../model/expert/expertModel"
import { PostType } from "../../model/user/postModel"
import { UserType } from "../../model/user/userModel"
import { MeetingCountType, MonthlyUserPostReportType, PostCountType } from "../../types/type"

interface IUserService{
    createUser(user: UserType):Promise<UserType>
    findByEmail(email:String):Promise<UserType | null>
    updateUser(email: string, data: UserType): Promise<UserType | null> 
    getUserByEmail(email: string): Promise<UserType | null>
    updateUserById(id: string ,  data: UserType): Promise<UserType |string | null >
    getUserById(id :  string):Promise<UserType | null>
    uploadPost(data:PostType):Promise<PostType | null>
    getUserPost(id: string,status: string | null,  page: number, limit: number, search:string): Promise<{
        posts: PostType[] | null;
        totalPosts: number;
        totalPages: number;
    } | null> 
    updatePostStatus(userId : string, postId:string,status:number):Promise<PostType | null>
    getExpertById(id: string):Promise<ExpertDocument | null >
    updatePostDetails(postId: string, postdata:PostType):Promise<PostType | null>
    getUserPostReport(userId: string):Promise<MonthlyUserPostReportType[] | null>
    getPostCount(userId: string):Promise<PostCountType | null>
    getMeetingDetails(userId: string):Promise<MeetingCountType | null> 
    getAllTechnologies():Promise<TechnologyType[] | null>
}

export default IUserService