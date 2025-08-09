export interface ParticipentDTO {
  id: string;
  role: string;
  name: string;
  profile_pic: string;
}

export interface ChatDTO {
  id?: string;
  participents: ParticipentDTO[];
  postId: string;
  messages: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

