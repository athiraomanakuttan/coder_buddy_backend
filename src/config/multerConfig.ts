import multer, { FileFilterCallback } from 'multer';
import { Request} from "express";
const storage = multer.memoryStorage();
export const upload = multer({ 
  storage: storage,
  fileFilter: (
    req: Request, 
    file: Express.Multer.File, 
    cb: FileFilterCallback
  ) => {

    if (file.fieldname === 'profilePicture' || file.fieldname === 'uploads') {

      if (file.mimetype.startsWith('image/')) {
        
        cb(null, true);
      } else {
        cb(null, false);

      }
    } else {
      cb(null, true);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
});