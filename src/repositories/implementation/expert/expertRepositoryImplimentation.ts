import Expert, { ExpertDocument } from "../../../model/expert/expertModel";
import { CommentType, Post, PostType } from "../../../model/user/postModel";
import IExpertRepository from "../../expert/expertRepository";

class ExpertRepositoryImplementation implements IExpertRepository {
    async createExpert(data: Partial<ExpertDocument>): Promise<ExpertDocument | null> {
        return await Expert.create(data);
    }

    async getExpertByEmail(email: string): Promise<ExpertDocument | null> {
        try {
            return await Expert.findOne({ email });
        } catch (error) {
            console.error("Error fetching expert by email:", error);
            return null;
        }
    }

    async getExpertById(id: string): Promise<ExpertDocument | null> {
        try {
            return await Expert.findOne({ _id: id });
        } catch (error) {
            console.error("Error fetching expert by ID:", error);
            return null;
        }
    }
    async updateExpertByEmail(email: string, data: Partial<ExpertDocument>): Promise<ExpertDocument | null> {
        try {
            const updatedExpert = await Expert.findOneAndUpdate(
                { email },          
                { $set: data },     
                { new: true }        
            );
            return updatedExpert;
        } catch (error) {
            console.error("Error updating expert by email:", error);
            return null;            
        }
    }
    async updateExpert(id: string, data: ExpertDocument): Promise<ExpertDocument | null> {
            const updatedExpert = await Expert.findOneAndUpdate(
                { _id: id },          
                { $set: data },     
                { new: true }        
            );
            return updatedExpert;
    }
    async getPostData(skip: number, limit: number, skillSet: string[] | null): Promise<any[] | null> {
        try {
          let postData;
      
          const matchCondition = !skillSet || skillSet.length === 0
            ? { status: 0 }
            : { technologies: { $in: skillSet }, status: 0 };
      
          postData = await Post.aggregate([
            { $match: matchCondition },
            { $skip: skip },
            { $limit: limit },
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
                comments: {
                  $push: {
                    $cond: {
                      if: { $ne: ["$comments", null] },
                      then: {
                        _id:"$comments._id",
                        comment: "$comments.comment",
                        status: "$comments.status",
                        date: "$comments.date",
                        expertId: "$comments.expertId",
                        expertName: { $ifNull: ["$expertDetails.first_name", null] }
                      },
                      else: "$$REMOVE"
                    }
                  }
                }
              }
            },
            {
              $project: {
                _id: 1,
                title: 1,
                description: 1,
                userId: 1,
                technologies: 1,
                uploads: 1,
                status: 1,
                comments: {
                  $cond: {
                    if: { $gt: [{ $size: "$comments" }, 0] },
                    then: "$comments",
                    else: "$$REMOVE"
                  }
                }
              }
            }
          ]);
      
          return postData;
        } catch (error) {
          console.error("Error fetching post data:", error);
          return null;
        }
      }

      async getPostCount(condition: object): Promise<number> {
          const postCount = await Post.find(condition).countDocuments()
          return postCount
      }
      
      async addComment(id: string, data: CommentType): Promise<PostType | null> {
         const comment = await Post.findOneAndUpdate({_id: id},{$push :{comments:data} },{ new: true })
         return comment
      }
      async deleteComment(commentId: string, expertId: string, postId: string): Promise<PostType | null> {
        const updatePost =  await Post.findOneAndUpdate({ _id: postId },{$pull : { comments : {_id: commentId , expertId : expertId }}}, { new: true }) 
        return updatePost
      }
}
export default ExpertRepositoryImplementation;
