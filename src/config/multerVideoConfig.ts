import multer, { FileFilterCallback } from 'multer';
import { Request } from "express";

const videoStorage = multer.memoryStorage();

const videoFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedVideoTypes = ['video/mp4', 'video/mkv', 'video/webm'];

  if (allowedVideoTypes.includes(file.mimetype)) {
    return cb(null, true); // Accept video
  } else {
    return cb(new Error('Invalid video type. Only MP4, MKV, and WebM are allowed!') as unknown as null, false);
  }
};

// Multer for Videos
export const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});
