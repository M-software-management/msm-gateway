import express from "express"
import * as fs from 'fs';
import multer from 'multer'


const app = express();
app.use(express.json());


const router = express.Router()
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
})


export default router
