import express from "express"
import {Getusers, Getuser, updateuser, getself, deleteuser, Getuserwork, Getuseremail, Getallworkuser} from "../controllers/user.js"
import {Adminonly, overlord} from "../jwtauth-role.js"
import Authtoken from '../jwtauth.js'
import nodemailer from 'nodemailer'
import jwt from "jsonwebtoken";
import axios from "axios"

const app = express();

app.use(express.json());

const transporter = nodemailer.createTransport({
    host: "m16.siteground.biz",
    port: 465,
    auth:{
        user:"contact@jeremymichaelsontreeservice.com",
        pass:"contact2022",
    }
})


const test = {
    id: "3",
    email: "lm",
    password: "test",
}

const JWT_SECRET = "msmtest"

const router = express.Router()

router.get("/", Getusers)
router.get("/:id", Getuser)
router.get("/info/:email", Getuseremail)
router.put("/acm/:id", updateuser)
router.get("/me/self", getself)
router.delete("/acm/:id", Authtoken ,Adminonly, deleteuser)
router.get("/work/all", Getuserwork)
router.get("/acm/work/emails", Getallworkuser)


router.post("/password-link", (req, res)=>{
    const { email } = req.body;

    if(email){
        res.send('user is not there');
        return;
    }
    const secret = JWT_SECRET;
    const payload = {
        email: email,
        id: test.id,
    }
    const token = jwt.sign(payload,secret, {expiresIn: '15m'})
    const link = `http://localhost:3000/user/reset-password/${test.id}/${token}`
    console.log(link)
    res.send('Password reset link has been sent!')
    const mailinfo = {
        from: "contact@jeremymichaelsontreeservice.com",
        to: "lmichaelson@rmsn.us",
        subject: "password reset link",
        text:link,
    }

    transporter.sendMail(mailinfo, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log("Email Sent!")
        }
    })

})


router.get("/password-token/check/:id/:token", async (req,res) =>{
    const { id, token } = req.params;

    //const user = await axios.get(`http://localhost:8800/v1/user/${id}`);
    //if (!user) {
    //    return res.json({ status: "User Does Not Exists!"})
    //}

    const secret = JWT_SECRET;
    try{
        const verify = jwt.verify(token, secret);
        res.send("verifed");
    }catch (error) {
        res.send("Not Verifed")
    }
})


export default router