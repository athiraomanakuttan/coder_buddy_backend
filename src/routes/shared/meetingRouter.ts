import { Router } from "express";
import MeetingRepositoryImplementation from "../../repositories/implementation/shared/meetingRepositoryImplimentation";
import MeetingService from "../../services/shared/Implementation/meetingService";
import MeetingController from "../../controller/shared/meetingController";
import authenticationMiddleware from "../../middleware/authenticationMiddleware";
const router = Router()

const meetingRepositoryImplementation = new MeetingRepositoryImplementation()
const meetingService = new MeetingService(meetingRepositoryImplementation)
const meetingController =  new MeetingController(meetingService)

router.post('/create-meeting', authenticationMiddleware as any , (req,res)=>meetingController.createMeetingLink(req,res))
router.get('/get-meeting-data', authenticationMiddleware as any, (req,res)=>meetingController.getMeetingDetails(req,res))
router.get('/get-meeting/:meetingId', authenticationMiddleware as any, (req,res)=> meetingController.getMeetingById(req,res))
router.get('/get-user-meetings', authenticationMiddleware as any , (req,res)=> meetingController.getUserMeetings(req,res))

router.get('/get-meeting-report', authenticationMiddleware as any , (req,res)=> meetingController.getMeetingReport(req,res))
router.post('/update-meeting/:status', authenticationMiddleware as any, (req,res)=> meetingController.updateMeetingStatus(req,res))
router.post('/update-rating', authenticationMiddleware as any, (req,res)=> meetingController.updateMeetingRating(req,res))
router.get('/get-meeting-feedback', authenticationMiddleware as any, (req,res)=> meetingController.getMeetingFeedback(req,res))
export default router;