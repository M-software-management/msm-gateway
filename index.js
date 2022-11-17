import express from 'express'
import authroutes from "./routes/auth.js"
import usersroutes from "./routes/users.js"
import workroutes from "./routes/work.js"
import shiftroutes from "./routes/shift.js"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import Authtoken from './jwtauth.js'
import Cacheroutes from "./redis.js"


const app = express();

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Credentials", true)
    next()
})


app.use(cors({
    origin: "http://localhost:3000",
}));
app.use(express.json());
app.use(cookieParser());
app.use("/v1/auth", authroutes)
app.use("/v1/user", usersroutes)
app.use("/v1/work", workroutes)
app.use("/v1/shift", shiftroutes)
app.use("/uploads", Authtoken, express.static("./uploads"))
app.use("/v1/c", Cacheroutes)

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

app.post('/v1/upload', upload.single('file'), function (req, res) {
  res.status(200).json(req.file.path);
})


app.listen(8800, () => {
    console.log('connected to backend!')
});