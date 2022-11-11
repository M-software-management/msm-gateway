import express from "express"
import * as dotenv from 'dotenv' 
dotenv.config()
import * as fs from 'fs';
import multer from 'multer'

const router = express.Router()
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); //important this is a direct path fron our current file to storage location
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

router.post('/upload', upload.single('image'),(req, res) => {
  console.log(req.file)
  res.send('Successfully uploaded')
})


export default router
