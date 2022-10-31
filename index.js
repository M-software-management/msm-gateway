import express from 'express'
import authroutes from "./routes/auth.js"
import usersroutes from "./routes/users.js"
import workroutes from "./routes/work.js"
import shiftroutes from "./routes/shift.js"
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
app.use("/api/auth", authroutes)
app.use("/api/user", usersroutes)
app.use("/api/work", workroutes)
app.use("/api/shift", shiftroutes)

app.listen(8800, () => {
    console.log('connected to backend!')
});