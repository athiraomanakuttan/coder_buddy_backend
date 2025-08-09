export interface CommentDTO {
  expertId: string;
  comment: string;
  status?: number;
  date?: Date;
}

export interface PostDTO {
  id: string;
  title: string;
  userId: string;
  description: string;
  technologies: string[];
  uploads?: string;
  comments: CommentDTO[];
  status: number;
}

