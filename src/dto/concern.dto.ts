export interface MessageDTO {
  message: string;
  userType: string;
  dateAndTime: Date;
}

export interface ConcernDTO {
  id?: string;
  title: string;
  description: string;
  role: string;
  concernMeetingId?: string;
  concernUserId?: string;
  video?: string;
  message?: MessageDTO[];
  userId: string;
  status: number;
  createdAt?: Date;
  updatedAt?: Date;
}

