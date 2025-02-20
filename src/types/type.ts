import {Request} from 'express'
import { ConcernDataType } from '../model/shared/concern.model';
import { MeetingUserType } from '../model/shared/meeting.model';
export type basicType={
    email:string;
    password : string;
}

export interface CustomType extends Request{
    id?:string
}

export interface CustomMeetingDataType{
    title: string,
    _id: string
}

export interface ConcernResponseDataType{
    concernData: ConcernDataType[],
    totalRecord : number
}

export interface MeetingDataResponseType {
    meetingData : MeetingUserType[],
    dataCount : number
}

export interface StatusCount {
    status: number;
    count: number;
}

export interface MonthlyUserPostReportType {
    _id: {
        year: number;
        month: number;
    };
    statuses: StatusCount[];
}

export interface MonthlyReport {
    month: number;        
    totalMeetings: number;  
}

export interface MonthlyAdminProfitReport {
    month: number;  
    profit: number;
}

export interface MonthlyProfitResult {
    _id: { month: number };
    totalProfit: number;
}

 export interface RatingData {
    userId: string;
    meetingRating ?: number;
    participantBehavior ?: number;
    feedback ?: string;
  }

  export interface PostCountType {
    totalPost : number,
    pendingPost: number,
    resolvedPost: number
  }

  export interface MeetingCountType{
    totalMeetings : number,
    scheduledMeeting: number
  }

  export interface MeetingReportType{
    totalMeetings: number,
    scheduledMeeting: number
  }