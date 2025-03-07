import { Response, NextFunction } from "express";
import { CustomRequest } from "./authenticationMiddleware";


const isAdmin = (req:CustomRequest, res:Response , next: NextFunction)=>{
    if(req.role && req.role === "admin")
        next()
    else
    res.status(401).send({ error: 'Admin Authentication failed' });
}

export default isAdmin