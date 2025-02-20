import  {Router,Request,Response}  from 'express'
import { upload } from '../../config/multerConfig';

import UserController from "../../controller/user/userController";
import UserService from '../../services/user/Implimentation/userServices';
import UserRepositoryImplementation from '../../repositories/implementation/user/userRepositoryImplemenatation';
import ProfileController from '../../controller/user/profileController';
import PostController from '../../controller/user/postController';
// middlewares
import authenticationMiddleware from '../../middleware/authenticationMiddleware';
import checkisUserBlocked from '../../middleware/userBlocked';


const userRepositoryImplementation = new UserRepositoryImplementation();
const userService = new UserService(userRepositoryImplementation);
const userController = new UserController(userService)
const profileController = new ProfileController(userService)
const postController = new PostController(userService)

const router = Router()

router.post('/signup',(req,res) => userController.signupPost(req,res));
router.post('/verify-otp',(req,res)=> userController.verifyOtp(req,res))
router.post('/login',(req,res)=>userController.loginPost(req,res))

router.get('/get-profile',authenticationMiddleware as any,checkisUserBlocked  as any,(req,res)=>profileController.getProfile(req,res))
router.put('/update-profile', authenticationMiddleware as any,checkisUserBlocked  as any,upload.single('profilePicture')  ,(req, res)=>profileController.updateProfile(req,res))


router.post('/forgot-password',(req,res)=>userController.forgotPassword(req,res))
router.put('/update-password',(req,res)=> userController.updatePassword(req,res))
router.post('/google-signin',(req,res)=>userController.googleSinup(req,res))

router.post('/upload-post',    authenticationMiddleware as any,     checkisUserBlocked as any,     upload.single('uploads'),  (req, res) => postController.createPost(req, res))
router.post('/get-post-details',authenticationMiddleware as any,checkisUserBlocked as any,(req,res)=> postController.getPostDetails(req,res))
router.put('/update-post-status', authenticationMiddleware as any, checkisUserBlocked as any, (req,res)=>postController.updatePostStatus(req,res) )
router.get('/search-post/:search/:status',authenticationMiddleware as any , (req,res)=> postController.searchPost(req,res))
router.put('/update-post', authenticationMiddleware as any, upload.single('uploads'), (req,res)=>postController.updatePost(req,res))

router.get('/expert-profile/:id',authenticationMiddleware as any , (req,res)=>profileController.getExpertProfile(req,res))

router.get('/get-post-report', authenticationMiddleware as any, (req,res)=> postController.getPostReport(req,res))
router.get('/get-dashboard-report', authenticationMiddleware as any, (req,res)=> userController.getDashboardReport(req,res) ) 
export default router;