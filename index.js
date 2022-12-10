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



const app = express();

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Credentials", true)
    next()
})

//const notif = await Getnotification()


app.use(cors({
    origin: "https://shifts.rmsn.us",
}));
app.use(express.json());
app.use(cookieParser());
app.use("/v1/auth", authroutes)
app.use("/v1/user", usersroutes)
app.use("/v1/work", workroutes)
app.use("/v1/shift", shiftroutes)
app.use("/v2/notification", notificationroutes)
app.use("/uploads", Authtoken, express.static("./uploads"))

const router = express.Router()
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
  res.status(200).json(file.filename);
})


const transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    auth:{
        user:"no-reply@sfhs.rmsn.us",
        pass:"8985ec1c2f91fa1010eaa6246a5320ce-f2340574-f8ef4120",
    }
})

app.post("/v1/email-api", (req,res) => {
  const not = notif
  const text = not.body.text;
  const subject = not.body.subject;
  const people  = req.body.to;
  res.send("Email Sent!")
  const mailinfo = {
    from: " Sfhs Alerts <no-reply@sfhs.rmsn.us>",
    to: people,
    subject: subject,
    text:text,
    template: "sfhs-alerts",

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