import { Router } from "express";
import { upload } from "../../config/multerConfig";
import ExpertController from "../../controller/expert/expertController";
import ExpertRepositoryImplementation from "../../repositories/implementation/expert/expertRepositoryImplimentation";
import ExpertService from "../../services/expert/Implimentation/expertServices";
import authenticationMiddleware from "../../middleware/authenticationMiddleware";
import ProfileController from "../../controller/expert/profileController";
import checkExpertBlocked from "../../middleware/expertBlocked";
import PostController from "../../controller/expert/postController";
import MeetingService from "../../services/expert/Implimentation/meetingService";
import MeetingRepositoryImplimentation from "../../repositories/implementation/expert/meetingRepositoryImplimentation";
import MeetingController from "../../controller/expert/meetingController";
import PaymentRepositoryImplimentation from "../../repositories/implementation/expert/paymentRepositoryImplimentation";
import UserRepositoryImplimentation from "../../repositories/implementation/user/userRepositoryImplemenatation";
import PaymentService from "../../services/expert/Implimentation/paymentService";
import PaymentController from "../../controller/expert/paymentController";
import UserService from "../../services/user/Implimentation/userServices";
import ReportController from "../../controller/expert/reportController";
// import

const router = Router();
// repository
const expertRepositoryImplementation = new ExpertRepositoryImplementation();
const meetingRepositoryImplimentation = new MeetingRepositoryImplimentation();
const paymentRepositoryImplimentation = new PaymentRepositoryImplimentation()
const userRepositoryImplimentation = new UserRepositoryImplimentation()

// service
const expertService = new ExpertService(expertRepositoryImplementation);
const meetingService = new MeetingService(meetingRepositoryImplimentation)
const paymentService =  new PaymentService(paymentRepositoryImplimentation)
const userService =  new UserService(userRepositoryImplimentation)

//constroller
const expertController = new ExpertController(expertService,userService);
const profileController = new ProfileController(expertService)
const postController = new PostController(expertService)
const meetingController = new MeetingController(meetingService)
const paymentController = new PaymentController(paymentService, expertService)
const reportController = new ReportController(meetingService,paymentService)

router.post('/signup', (req, res) => expertController.signupPost(req, res));
router.post('/login',(req,res)=> expertController.loginPost(req,res))
router.post('/verify-otp',(req,res)=>expertController.verifyOtp(req,res))

router.post('/forgot-password',(req,res)=> expertController.forgotPassword(req,res))
router.put('/update-password',(req,res)=> expertController.updatePassword(req,res))
router.post('/google-signup',(req,res)=>expertController.googleSignup(req,res))


router.get('/get-expert-details',authenticationMiddleware as any,checkExpertBlocked  as any,(req,res)=> profileController.getExpertDetails(req,res) )
router.put('/update-profile',authenticationMiddleware as any,checkExpertBlocked  as any,upload.single('profilePicture'),(req,res)=> profileController.updateProfile(req,res) )

router.get('/get-post', authenticationMiddleware as any, (req, res) => postController.getPost(req, res));

router.post('/add-comment', authenticationMiddleware as any , (req,res)=>postController.addComment(req,res) )
router.put('/delete-comment', authenticationMiddleware as any , (req,res)=>postController.deleteComment(req,res))

router.get('/admin-meeting', authenticationMiddleware as any, (req,res)=>meetingController.getAdminExpertMeeting(req,res) )
router.post('/meetings/join',  (req,res)=> meetingController.verifyMeeting(req,res))

router.post('/create-payment-link', authenticationMiddleware as any, (req,res)=>paymentController.createPayment(req,res))

router.get('/get-user-profile/:id', authenticationMiddleware as any, (req,res)=> expertController.getUserProfileById(req,res))

router.get('/get-dashbord-data', authenticationMiddleware as any, (req,res)=> reportController.getExpertReport(req,res))


export default router;
    