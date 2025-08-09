import { PostType, CommentType } from '../model/user/postModel';
import { PostDTO, CommentDTO } from '../dto/post.dto';

function toCommentDTO(comment: CommentType): CommentDTO {
  return {
    expertId: comment.expertId,
    comment: comment.comment,
    status: comment.status,
    date: comment.date,
  };
}

export function toPostDTO(post: PostType): PostDTO {
  return {
    id: post._id?.toString() ?? '',
    title: post.title,
    userId: post.userId,
    description: post.description,
    technologies: post.technologies,
    uploads: post.uploads,
    comments: post.comments?.map(toCommentDTO) ?? [],
    status: post.status,
  };
}

