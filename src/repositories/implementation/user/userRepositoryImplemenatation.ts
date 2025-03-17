import IUserRepository from "../../user/userRepository";
import { User,UserType } from "../../../model/user/userModel";
import { Post, PostType } from "../../../model/user/postModel";
import Expert , { ExpertDocument } from "../../../model/expert/expertModel";
import { MeetingCountType, MonthlyUserPostReportType, PostCountType } from "../../../types/type";
import { MeetingUser } from "../../../model/shared/meeting.model";
import { Technology, TechnologyType } from "../../../model/admin/technology";

class UserRepositoryImplementation implements IUserRepository{
    async createUser(user: UserType): Promise<UserType> {
        const newUser = await User.create(user)
        return newUser
    }
    async findByEmail(email: String): Promise<UserType | null> {
        const getUser = await User.findOne({email :  email});
        return getUser;
    }
    async updateUserByEmail(email: string, data: UserType): Promise<UserType | null> {
        const updatedUser = await User.findOneAndUpdate({ email }, data, { new: true });
        return updatedUser;
    }
    async getUserByEmail(email: string): Promise<UserType | null> {
        return await User.findOne({ email });
    }
    async findById(id: string): Promise<UserType | null> {
        return await User.findOne({_id:id})
    }
    async updateById(id: String, user: UserType): Promise<UserType | string | null> {
        return await User.findOneAndUpdate({_id:id},user,{new : true})
    }
    async uploadPost(data: PostType): Promise<PostType | null> {
        const uploadPost = await Post.create(data)
        return uploadPost
    }
    async getPostDetails(
        id: string, 
        status: string | null, 
        skip: number = 0, 
        limit: number = 5,
        searchQuery: string = ""
    ): Promise<{
        posts: PostType[];
        totalPosts: number;
        totalPages: number;
    } | null> {
        let poststatus: number[] = [0, 1, 2];
    
        if (status !== null && status !== "null") {
            poststatus = [Number(status)];
        }
    
        const searchConditions = searchQuery
            ? {
                  $or: [
                      { title: { $regex: searchQuery, $options: "i" } },
                      { description: { $regex: searchQuery, $options: "i" } },
                      { technologies: { $regex: searchQuery, $options: "i" } }
                  ],
                  userId: id,
                  status: { $in: poststatus }
              }
            : { userId: id, status: { $in: poststatus } };
    
        try {
            const postDetails = await Post.aggregate([
                { $match: searchConditions },
                
                { $skip: skip },
                { $limit: limit },
                {
                    $addFields: {
                        hasComments: {
                            $cond: {
                                if: { $gt: [{ $size: "$comments" }, 0] },
                                then: true,
                                else: false
                            }
                        }
                    }
                },
                {
                    $unwind: {
                        path: "$comments",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "experts",
                        let: { expertId: { $toObjectId: "$comments.expertId" } },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$expertId"]
                                    }
                                }
                            }
                        ],
                        as: "expertDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$expertDetails",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        title: { $first: "$title" },
                        description: { $first: "$description" },
                        userId: { $first: "$userId" },
                        technologies: { $first: "$technologies" },
                        uploads: { $first: "$uploads" },
                        status: { $first: "$status" },
                        hasComments: { $first: "$hasComments" },
                        createdAt: { $first: "$createdAt" },
                        updatedAt: { $first: "$updatedAt" },
                        comments: {
                            $push: {
                                $cond: {
                                    if: { $and: [
                                        { $ne: ["$comments", null] },
                                        { $ne: ["$expertDetails", null] }
                                    ]},
                                    then: {
                                        _id: "$comments._id",
                                        comment: "$comments.comment",
                                        status: "$comments.status",
                                        date: "$comments.date",
                                        expertId: "$comments.expertId",
                                        expert_name: {
                                            $concat: [
                                                { $ifNull: ["$expertDetails.first_name", ""] },
                                                " ",
                                                { $ifNull: ["$expertDetails.last_name", ""] }
                                            ]
                                        },
                                        expert_image_url: "$expertDetails.profilePicture",
                                        uploaded_time: "$comments.date"
                                    },
                                    else: "$$REMOVE"
                                }
                            }
                        }
                    }
                },
                { $sort: {  _id : -1 } },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        description: 1,
                        userId: 1,
                        technologies: 1,
                        uploads: 1,
                        status: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        comments: {
                            $cond: {
                                if: "$hasComments",
                                then: "$comments",
                                else: "$$REMOVE"
                            }
                        }
                    }
                }
            ]);
    
            const totalPosts = await Post.countDocuments(searchConditions);
    
            return {
                posts: postDetails,
                totalPosts: totalPosts,
                totalPages: Math.ceil(totalPosts / limit)
            };
        } catch (error) {
            console.error("Error fetching posts:", error);
            return null;
        }
    }
    
    
    async countPosts(id: string, status: string | null): Promise<number> {
        const poststatus: (string | number)[] =  status!== null ? [status] : [0,1,2]
        const count  =  await Post.countDocuments({userId : id, status:{$in : poststatus}})
        return count;
    }
    async updatePostStatus(userId : string , id: string, status: number): Promise<PostType | null> {
        const updatePost = await Post.findOneAndUpdate({_id:id, userId:userId},{$set:{status}},{new: true})
        return updatePost
    }

    async findExpertById(id: string): Promise<ExpertDocument | null> {
        const data = await Expert.findOne({_id : id , status: 1 , isVerified  : 1})
        return data
    }
    async updatePostData(postId: string, postData: PostType): Promise<PostType | null> {
        
        const updatedData = await Post.findOneAndUpdate({_id: postId},{$set:postData},{new: true})
        return updatedData
    }

    async getPostReport(userId: string): Promise<MonthlyUserPostReportType[] | null> {
        try {
            const report = await Post.aggregate([
                {
                    $match: { userId } // Filter posts by userId
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                            status: "$status"
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: { year: "$_id.year", month: "$_id.month" },
                        statuses: {
                            $push: {
                                status: "$_id.status",
                                count: "$count"
                            }
                        }
                    }
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1 }
                }
            ]);
    
            return report;
        } catch (error) {
            console.error("Error fetching user post report:", error);
            return null;
        }  
    }
     
    async getPostCount(userId: string): Promise<PostCountType | null> {
        const result = await Post.aggregate([
            { $match: { userId } }, // Filter posts by userId
            { 
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
    
        // Initialize counts
        let totalPost = 0;
        let resolvedPost = 0;
        let pendingPost = 0;
    
        // Map results to counts
        result.forEach(({ _id, count }) => {
            totalPost += count;
            if (_id === 1) resolvedPost = count;
            if (_id === 0) pendingPost = count;
        });
    
        return { totalPost, resolvedPost, pendingPost };
    }

    async getMeetingDetails(userId: string): Promise<MeetingCountType | null> {
        const data = await MeetingUser.aggregate([{$match: {userId}},{$group : {
            _id : '$status',
            count : {$sum : 1}
        }}])

        let totalMeetings = 0
        let scheduledMeeting = 0

        data.forEach(({_id,count}) =>{
            if(_id === 0)  scheduledMeeting = count
            else   totalMeetings = count
        })
        return { totalMeetings , scheduledMeeting}
    }

    async getAllTechnologies(): Promise<TechnologyType[] | null> {
        const data = await Technology.find({status:1}).sort({createdAt:-1})
        return data
    }

     
}

export default UserRepositoryImplementation;