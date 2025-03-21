
import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user/Implimentation/userServices';
import UserRepositoryImplementation from '../repositories/implementation/user/userRepositoryImplemenatation';
export interface CustomRequest extends Request {
    user?: string;
    token?: string;
    id?: string;
  }
  const userRepositoryImplementation =  new UserRepositoryImplementation()
  const userServices = new UserService(userRepositoryImplementation)
const checkisUserBlocked = async(req : CustomRequest,res : Response,next: NextFunction)=>{
    const userId = req.id;
    if(!userId){
        res.status(401).send({ error: 'Authentication failed.' });
        return;
    }
    const getUserData = await userServices.getUserById(userId)
    if(!getUserData){
        res.status(401).send({ error: 'Authentication failed.' });
        return;
    }
    else if(getUserData.status !== 1){
        res.status(401).send({ error: 'user is blocked' });
        return;
    }
    next()
}
export default checkisUserBlocked