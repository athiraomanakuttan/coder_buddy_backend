import { MeetingType } from '../model/admin/meetingModel';
import { CustomMeetingDTO, MeetingDTO } from '../dto/meeting.dto';
import { MeetingUserType } from '../model/shared/meeting.model';
import { CustomMeetingDataType } from '../types/type';

export function toMeetingDTO(meeting: MeetingUserType ): MeetingDTO {
  return {
    id: meeting._id?.toString() ?? '',
    meetingId: meeting.meetingId,
    title: meeting.title,
    userId: meeting.userId,
    dateTime: meeting.dateTime,
    status: meeting.status,
  };
}

export function toCustomMeetingDTO(meeting: CustomMeetingDataType): CustomMeetingDTO {
  return {
    title: meeting.title,
    _id: meeting._id?.toString() ?? '',
  };
}