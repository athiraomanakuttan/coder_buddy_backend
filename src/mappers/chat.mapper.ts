import { ChatType, ParticipentsType } from '../model/shared/chat.model';
import { ChatDTO, ParticipentDTO } from '../dto/chat.dto';

function toParticipentDTO(part: ParticipentsType): ParticipentDTO {
  return {
    id: part.id,
    role: part.role,
    name: part.name,
    profile_pic: part.profile_pic,
  };
}

export function toChatDTO(chat: ChatType): ChatDTO {
  return {
    id: chat._id?.toString(),
    participents: chat.participents?.map(toParticipentDTO) ?? [],
    postId: chat.postId?.toString() ?? '',
    messages: chat.messages?.map(m => m.toString()) ?? [],
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
  };
}

