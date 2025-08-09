import { ExpertDocument } from '../model/expert/expertModel';
import { ExpertDTO, QualificationDTO, ExperienceDTO, CustomExpertDTO } from '../dto/expert.dto';

export function toExpertDTO(expert: ExpertDocument): ExpertDTO {
  return {
    id: expert._id?.toString() ?? '',
    first_name: expert.first_name,
    last_name: expert.last_name,
    email: expert.email,
    qualification: expert.qualification as QualificationDTO,
    primary_contact: expert.primary_contact,
    secondary_contact: expert.secondary_contact,
    experience: expert.experience as ExperienceDTO,
    current_domain: expert.current_domain,
    total_experience: expert.total_experience,
    skills: expert.skills,
    address: expert.address,
    profilePicture: expert.profilePicture,
    status: expert.status,
    isVerified: expert.isVerified,
    isMeetingScheduled: expert.isMeetingScheduled,
  };
}
export function toCustomExpertDTO(expert: ExpertDocument): CustomExpertDTO {
  return {
    id: expert._id?.toString() ?? '',
    first_name: expert.first_name,
    last_name: expert.last_name,
    email: expert.email,
    qualification: expert.qualification as QualificationDTO,
    primary_contact: expert.primary_contact,
    secondary_contact: expert.secondary_contact,
    experience: expert.experience as ExperienceDTO,
    current_domain: expert.current_domain,
    total_experience: expert.total_experience,
    skills: expert.skills,
    address: expert.address,
    profilePicture: expert.profilePicture,
    status: expert.status,
    isVerified: expert.isVerified,
    isMeetingScheduled: expert.isMeetingScheduled,
  };
}

