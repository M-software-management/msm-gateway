import express from 'express'
import authroutes from "./routes/auth.js"
import usersroutes from "./routes/users.js"
import workroutes from "./routes/work.js"
import shiftroutes from "./routes/shift.js"
import uploadroutes from "./s3.js"
import cors from 'cors'
import cookieParser from 'cookie-parser'



const app = express();

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Credentials", true)
    next()
})


app.use(cors({
    origin: "https://shifts.rmsn.us",
}));
app.use(express.json());
app.use(cookieParser());
app.use("/v1/auth", authroutes)
app.use("/v1/user", usersroutes)
app.use("/v1/work", workroutes)
app.use("/v1/shift", shiftroutes)
app.use("/v1/cdn", uploadroutes)


app.listen(8800, () => {
    console.log('connected to backend!')
});