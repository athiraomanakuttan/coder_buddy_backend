export interface UserDTO {
  toObject(): import("../model/user/userModel").UserType;
  id: string;
  email?: string;
  qualification?: { qualification: string; college: string }[];
  address?: string;
  experiance?: string;
  job_title?: string;
  occupation?: string;
  employer?: string;
  start_date?: Date;
  end_date?: Date;
  first_name?: string;
  last_name?: string;
  status?: number;
  skills?: string[];
  profilePicture?: string;
}

export interface CustomUserDTO{
  toObject(): import("../model/user/userModel").UserType;
  id: string;
  email?: string;
  qualification?: { qualification: string; college: string }[];
  address?: string;
  experiance?: string;
  job_title?: string;
  occupation?: string;
  employer?: string;
  start_date?: Date;
  end_date?: Date;
  first_name?: string;
  last_name?: string;
  status?: number;
  skills?: string[];
  profilePicture?: string;
  password?:string;
}