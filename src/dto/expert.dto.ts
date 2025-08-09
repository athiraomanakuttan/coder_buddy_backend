export interface QualificationDTO {
  qualification?: string;
  college?: string;
  year_of_passout?: string;
}

export interface ExperienceDTO {
  job_role?: string;
  employer?: string;
  start_date?: string;
  end_date?: string;
}

export interface ExpertDTO {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  qualification?: QualificationDTO;
  primary_contact?: number;
  secondary_contact?: number;
  experience?: ExperienceDTO;
  current_domain?: string;
  total_experience?: number;
  skills?: string[];
  address?: string;
  profilePicture?: string;
  status?: number;
  isVerified?: number;
  isMeetingScheduled?: number;
}

