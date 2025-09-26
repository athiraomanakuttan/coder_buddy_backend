import Expert, { ExpertDocument } from "../../../model/expert/expertModel";
import { CommentType, Post, PostType } from "../../../model/user/postModel";
import IExpertRepository from "../../expert/expertRepository";
import { BaseRepository } from "../../base";

class ExpertRepositoryImplementation extends BaseRepository<ExpertDocument> implements IExpertRepository {
    constructor() {
        super(Expert);
    }

    async createExpert(data: Partial<ExpertDocument>): Promise<ExpertDocument | null> {
        return await this.create(data as ExpertDocument);
    }

    async getExpertByEmail(email: string): Promise<ExpertDocument | null> {
        return await this.findByEmail(email);
    }

    async getExpertById(expertId: string): Promise<ExpertDocument | null> {
        return await this.findById(expertId);
    }

    async updateExpertByEmail(email: string, data: Partial<ExpertDocument>): Promise<ExpertDocument | null> {
        return await this.updateByEmail(email, data);
    }

    async updateExpert(expertId: string, data: ExpertDocument): Promise<ExpertDocument | null> {
        return await this.updateById(expertId, data);
    }

    async getPostData(skip: number, limit: number, skillSet: string[] | null): Promise<any[] | null> {
        try {
            const matchCondition = !skillSet || skillSet.length === 0
                ? { status: 0 }
                : { technologies: { $in: skillSet }, status: 0 };

            const postData = await Post.aggregate([
                {$sort : {updatedAt: -1}},
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
                                        _id: "$comments._id",
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
        return await Post.countDocuments(condition);
    }

    async addComment(postId: string, data: CommentType): Promise<PostType | null> {
        return await Post.findOneAndUpdate({ _id: postId }, { $push: { comments: data } }, { new: true });
    }

    async deleteComment(commentId: string, expertId: string, postId: string): Promise<PostType | null> {
        return await Post.findOneAndUpdate({ _id: postId }, { $pull: { comments: { _id: commentId, expertId: expertId } } }, { new: true });
    }
}

export default ExpertRepositoryImplementation;
