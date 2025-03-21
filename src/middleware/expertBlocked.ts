
import { Request, Response, NextFunction } from 'express';
import ExpertService from '../services/expert/Implimentation/expertServices';
import ExpertRepositoryImplementation from '../repositories/implementation/expert/expertRepositoryImplimentation';

export interface CustomRequest extends Request {
    user?: string;
    token?: string;
    id?: string;
  }
  const expertRepositoryImplementation =  new ExpertRepositoryImplementation()
  const exportService = new ExpertService(expertRepositoryImplementation)
const checkExpertBlocked = async(req : CustomRequest,res : Response,next: NextFunction)=>{
    const expertId = req.id;
    if(!expertId){
        res.status(401).send({ error: 'Authentication failed.' });
        return;
    }
    const getExpertData = await exportService.getExpertById(expertId)
    if(!getExpertData){
        res.status(401).send({ error: 'Authentication failed.' });
        return;
    }
    else if(getExpertData.status !== 1){
        res.status(401).send({ error: 'user is blocked' });
        return;
    }
    next()
}
export default checkExpertBlocked