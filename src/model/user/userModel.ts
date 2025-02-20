import { Schema, Types, Document, model } from 'mongoose';

interface UserType extends Document {
  email?: string;
  password?: string;
  qualification?: [{ qualification: string; college: string }];
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

const userSchema = new Schema<UserType>({
  email: {
    type: String,
    required: true,
    message: "Email id required",
    unique: true,
  },
  password: {
    type: String,
    message: "password is required",
  },
  qualification: [
    {
      qualification: {
        type: String,
      }, 
      college: {
        type: String,
      },
    },
  ],
  address: {
    type: String,
  },
  experiance: {
    type: String,
  },
  job_title: {
    type: String,
  },
  occupation: {
    type: String,
  },
  employer: {
    type: String,
  },
  start_date: {
    type: String,
  },
  end_date: {
    type: String,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  status: {
    type: Number,
    enum: [0, 1, -1],
    default: 0,
  },
  skills: {
    type: [String], 
    default: [], 
  },
  profilePicture:{ type :  String}
});

const User = model<UserType>('user', userSchema);
export { User, UserType };
