import { UserType } from '../model/user/userModel';
import { UserDTO } from '../dto/user.dto';

export function toUserDTO(user: UserType): UserDTO {
  return {
  id: user._id?.toString() ?? '',
  email: user.email,
  qualification: user.qualification,
  address: user.address,
  experiance: user.experiance,
  job_title: user.job_title,
  occupation: user.occupation,
  employer: user.employer,
  start_date: user.start_date,
  end_date: user.end_date,
  first_name: user.first_name,
  last_name: user.last_name,
  status: user.status,
  skills: user.skills,
  profilePicture: user.profilePicture,
  toObject: function (): import("../model/user/userModel").UserType {
    throw new Error('Function not implemented.');
  },
};
}

