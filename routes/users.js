import express from "express"
import {Getusers, Getuser, updateuser, getself, deleteuser, Getuserwork, Getuseremail, Getallworkuser, Getuserrmsr} from "../controllers/user.js"
import {Adminonly, overlord} from "../jwtauth-role.js"
import Authtoken from '../jwtauth.js'
import nodemailer from 'nodemailer'
import jwt from "jsonwebtoken";
import axios from "axios"
import redis from 'redis'
import util from 'util'
import { createClient } from 'redis';
import { db } from "../db.js";
import bcrypt from "bcryptjs";


//const client = createClient({
  // url: 'redis://192.168.1.5:6379'
//})
  //await client.connect();

  //client.set = util.promisify(client.set)

  const ex = 3600

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
    id: "2",
    email: "alligongaming@gmail.com",
    password: "$2a$10$0DsqeL8g5Vvt47c2.VTzSufKUnWVR6sxEE0zgwPzIhwJFMGRL7RVe",
}

const JWT_SECRET = "msmtest"

const router = express.Router()
router.get("/getactive/2/2/2/2/4/:id", Getuserrmsr)
router.get("/", Getusers)
router.get("/:id", Getuser)
router.get("/info/:email", Getuseremail)
router.put("/acm/:id", updateuser)
router.get("/me/self", getself)
router.delete("/acm/:id", Authtoken ,Adminonly, deleteuser)
router.get("/work/all", Getuserwork)
router.get("/acm/work/emails", Getallworkuser)

 
export const getemail = async (req, res) => {
    const q = "SELECT * FROM sfhs.users WHERE `email`=?;"
  
    db.query(q, [req.body], (err, data) => {
      if (err) return res.status(500).json(err);
      return (data);
    });
  };




router.post("/password-link", async (req, res)=>{
    const email = req.body.email;
    const  user  =  getemail(email);

    if(!user){
        res.send('user is not there');
        return;
    }
    const secret = JWT_SECRET;
    const payload = {
        email: user,
        id: user,
    }
    const token = jwt.sign(payload,secret, {expiresIn: '15m'})
    client.set('password-token',token,{
        EX: ex,
      })
    const link = `http://localhost:3000/user/reset-password/${user}/${token}`
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


router.post("/password-token/check/:id/:token", async (req,res) =>{
    const { id, token } = req.params;

    //const user = await axios.get(`http://localhost:8800/v1/user/${id}`);
    //if (!user) {
    //    return res.json({ status: "User Does Not Exists!"})
    //}

    const secret = JWT_SECRET;
    try{
        const verify = jwt.verify(token, secret);
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync( salt);
      const q = "UPDATE users SET `password`=? WHERE user_id=? "
    
      db.query(q, [req.body.password,id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("updated");
      });
    }catch (error) {
        res.send("Not Verfied!")
    }
})


export default router