import { ConcernDataType, MessageType } from '../model/shared/concern.model';
import { ConcernDTO, MessageDTO } from '../dto/concern.dto';

function toMessageDTO(message: MessageType): MessageDTO {
  return {
    message: message.message,
    userType: message.userType,
    dateAndTime: message.dateAndTime,
  };
}

export function toConcernDTO(concern: ConcernDataType): ConcernDTO {
  return {
    id: concern._id?.toString(),
    title: concern.title,
    description: concern.description,
    role: concern.role,
    concernMeetingId: concern.concernMeetingId?.toString(),
    concernUserId: concern.concernUserId,
    video: concern.video,
    message: concern.message?.map(toMessageDTO),
    userId: concern.userId,
    status: concern.status,
    createdAt: concern.createdAt,
    updatedAt: concern.updatedAt,
  };
}

