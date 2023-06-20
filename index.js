import express from 'express'
import authroutes from "./routes/auth.js"
import usersroutes from "./routes/users.js"
import workroutes from "./routes/work.js"
import shiftroutes from "./routes/shift.js"
import notificationroutes from "./routes/notification.js"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import Authtoken from './jwtauth.js'
import nodemailer from 'nodemailer'
import { Getallworkuser } from './controllers/user.js'
import cron from 'cron'
import {SendMailAll} from './cron.js'
import { logger } from './config/logger.js'
import path from 'path'
import * as dotenv from 'dotenv'
dotenv.config()
import { transporter } from './Mail.js'
import { client } from './db.js'



const app = express();

app.use(logger)

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Credentials", true)
    next()
})





app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(cookieParser());
app.use("/v1/auth", authroutes)
app.use("/v1/user", usersroutes)
app.use("/v1/work", workroutes)
app.use("/v1/shift", shiftroutes)
app.use("/v1/notification", notificationroutes)
app.use("/uploads", express.static("./uploads"))
app.post("/cron/:id", SendMailAll)
app.get("/hello", (req,res)=>{
  console.log("lots of code")
  redisdata = client.get("test")
  res.status(200).json(redisdata)

})



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });


app.post('/v1/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  res.status(200).json(process.env.api_url + '/uploads/' + file.filename);
})




app.post("/v1/email-api", (req,res) => {
  const text = req.body.text;
  const subject = req.body.subject;
  const people  = req.body.to;
  res.send("Email Sent!")
  const mailinfo = {
    from: process.env.email_from,
    to: people,
    subject: subject,
    text: text,
  

}

transporter.sendMail(mailinfo, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log("Email Sent!")
    }
})
})





app.listen(8800, () => {
    console.log('connected to backend!')
});