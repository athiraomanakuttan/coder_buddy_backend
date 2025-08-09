export interface MeetingDTO {
  id: string;
  meetingId: string;
  title: string;
  userId: string;
  dateTime: Date;
  status?: number;
}

export interface CustomMeetingDTO {
  title: string,
  _id: string
}