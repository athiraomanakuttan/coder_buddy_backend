import Router from 'express'
import authenticationMiddleware from '../../middleware/authenticationMiddleware';

import AdminService from '../../services/admin/Implimentation/adminService';
import MeetingService from "../../services/admin/Implimentation/meetingService";
import ConcernService from '../../services/admin/Implimentation/concernService'
import TechnologyService from '../../services/admin/Implimentation/TechnologyService';

import AdminRepositoryImplimentation from '../../repositories/implementation/admin/adminRepositoryImplimentation';
import MeetingRepositoryImplementation from "../../repositories/implementation/admin/meetingRepositoryImplimentation";
import ConcernRepository from '../../repositories/implementation/admin/concernRepository';
import TechnologyRepository from '../../repositories/implementation/admin/technologyRepository';

import MeetingController from "../../controller/admin/meetingController"
import ConcernController from '../../controller/admin/concernController';
import AdminController from '../../controller/admin/adminController';
import ReportController from '../../controller/admin/reportController';
import TechnologyController from '../../controller/admin/technologyController';
import isAdmin from '../../middleware/isAdmin';

const router = Router();



const adminRepositoryImplimentation = new AdminRepositoryImplimentation()
const cornsernRepositoryImplimentation =  new ConcernRepository()
const meetingRepositoryImplementation =  new MeetingRepositoryImplementation()
const technologyRepositoryImplementaton =  new TechnologyRepository()
// const 

const adminService  = new AdminService(adminRepositoryImplimentation);
const meetingService = new MeetingService(meetingRepositoryImplementation)
const concernService = new ConcernService(cornsernRepositoryImplimentation)
const technologyService = new TechnologyService(technologyRepositoryImplementaton)

const adminController =  new AdminController(adminService )
const meetingController =  new MeetingController(meetingService , adminService)
const concernController =  new ConcernController(concernService)
const reportController = new ReportController(adminService,meetingService,concernService)
const technologyController = new TechnologyController(technologyService)

router.post('/login',(req,res)=>adminController.signupPost(req,res)) 
router.get('/user-details', authenticationMiddleware  as any, isAdmin, (req,res)=> adminController.getUserData(req,res) )
router.put('/changeUserStatus',authenticationMiddleware  as any,isAdmin,(req,res)=> adminController.changeUserStatus(req,res))
router.get('/get-user-profile/:id', authenticationMiddleware as any, isAdmin,  (req,res)=>adminController.getUserDataById(req,res))

router.get('/expert-details', authenticationMiddleware  as any, isAdmin, (req,res)=> adminController.getExpertData(req,res) )
router.get('/get-expert/:expertId',authenticationMiddleware  as any, isAdmin, (req,res)=> adminController.getExpertDetails(req,res))
router.put('/reject-expert',authenticationMiddleware  as any, isAdmin,(req,res)=> adminController.changeExpertStatus(req,res))
router.put('/change-expert-status', authenticationMiddleware as any, isAdmin, (req,res)=> adminController.enableDisableStatus(req,res))

router.post('/create-meeting-link',authenticationMiddleware  as any , isAdmin, (req,res)=> meetingController.createMeeting(req,res))
router.post('/get-meeting-details', authenticationMiddleware  as any , isAdmin, (req,res)=> meetingController.getMeetingDetails(req,res))
router.put('/approve-expert',authenticationMiddleware as any , isAdmin, (req,res)=>meetingController.approveExpert(req,res))

router.get('/get-concern-data', authenticationMiddleware as any, isAdmin, (req,res)=> concernController.getConcernDataByStatus(req,res))
router.get('/get-profit-report', authenticationMiddleware as any,isAdmin,  (req,res)=> adminController.getAdminProfitReport(req,res))

router.put("/update-concern-status", authenticationMiddleware as any,isAdmin, (req,res)=> concernController.updateConcernStatus(req,res))

router.get('/get-dasboard-data', authenticationMiddleware as any,isAdmin,  (req,res)=> reportController.getDashboardData(req,res))


router.post('/create-technology', authenticationMiddleware as any, isAdmin, (req,res)=>technologyController.createTechnoloy(req,res))
router.get('/get-technology', authenticationMiddleware as any,isAdmin,  (req,res)=> technologyController.getAllTechnologies(req,res))
router.put('/update-technology', authenticationMiddleware as any,isAdmin,  (req,res)=> technologyController.updateTechnology(req,res))
router.get("/get-wallet-data", authenticationMiddleware as any, isAdmin, (req, res)=> adminController.getWalletData(req,res))


export default router;