import mongoose, { Schema, Document } from "mongoose";

type QualificationType = {
  qualification?: string;
  college?: string;
  year_of_passout?: string;
};

type experienceType = {
  job_role?: string;
  employer?: string;
  start_date?: string;
  end_date?: string;
};

export interface ExpertDocument extends Document {
  _id:string;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  qualification?: QualificationType;
  primary_contact?: number;
  secondary_contact?: number;
  experience?: experienceType;
  current_domain?: string;
  total_experience?: number;
  skills ?:string[];
  address ?: string;
  profilePicture ?:string;
  status?: number;
  isVerified ?: number;
  isMeetingScheduled ?: number;
}

const ExpertSchema = new Schema<ExpertDocument>(
  {
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    email: { type: String, required: false },
    password:{ type : String},
    qualification: {
      qualification: { type: String },
      college: { type: String },
      year_of_passout: { type: String },
    },
    address:{ type : String},
    primary_contact: { type: Number },
    secondary_contact: { type: Number },
    experience: {
      job_role: { type: String },
      employer: { type: String },
      start_date: { type: String },
      end_date: { type: String },
    },
    isVerified : { type: Number, default:0, enum:[0,1]},
    isMeetingScheduled : { type: Number, default:0, enum:[0,1]},
    current_domain: { type: String },
    total_experience: { type: Number },
    skills: { type: [String] },
    profilePicture:{type: String},
    status: { type: Number, enum:[0,1,-1], default:0 },
  },
  {
    timestamps: true,  
  }
);

const Expert = mongoose.model<ExpertDocument>("Expert", ExpertSchema);

export default Expert;
