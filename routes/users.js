import express from "express"
import {Getusers, Getuser, updateuser, getself, deleteuser, Getuserwork, Getuseremail, Getallworkuser, updateuserNOT, Getgroup, Getgroup_2} from "../controllers/user.js"
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
import * as dotenv from 'dotenv'
dotenv.config()
import { transporter } from "../Mail.js"
import { render } from '@react-email/render';

const app = express();

app.use(express.json());


//const client = createClient({
  // url: 'rediss://default:AVNS_A6Py-k5w_BK3pT2VIC2@db-redis-nyc1-68088-do-user-14262902-0.b.db.ondigitalocean.com:25061'
//})
//client.on('error', err => console.log('Redis Client Error', err));
  //await client.connect();

  //client.on('connect', function(err){
    //console.log("Redis connected!-users")
  //});

  //client.set = util.promisify(client.set)

  const ex = 3600




const JWT_SECRET = process.env.jwt_sign

const router = express.Router()

router.get("/", Adminonly,Getusers)
router.get("/:id", Adminonly, Getuser)
router.get("/info/:email", Adminonly, Getuseremail)
router.put("/acm/:id", Adminonly, updateuser)
router.put("/update/self", updateuserNOT)
router.get("/me/self", getself)
router.delete("/acm/:id", Authtoken ,Adminonly, deleteuser)
router.get("/work/all", Getuserwork)
router.get("/acm/work/emails", Adminonly, Getallworkuser)
router.get("/groups/test/:id", Getgroup)
router.get("/groups/:id", Getgroup_2)



router.post("/password-link", async (req, res)=>{


  const q = "SELECT `user_id`,`email` FROM sfhs.users WHERE `email`=?;"
  
    db.query(q, [req.body.email], (err, data) => {
      if (err) return res.status(500).json(err);
      

    const email = req.body.email;
    const  user  =  data[0]

    if(!user){
        res.send('user is not there');
        return;
    }
    const secret = JWT_SECRET;
    const payload = {
        email: user.email,
        id: user.user_id,
    }
    const token = jwt.sign(payload,secret, {expiresIn: '15m'})
    client.set('password-token',token,{
        EX: ex,
      })
    const link = process.env.site_url +`/user/reset-password/${user.user_id}/${token}`
    console.log(link)
    res.send('Password reset link has been sent!')
    const mailinfo = {
        from: process.env.email_from,
        to: user.email,
        subject: "password reset link",
        text:link,
        html: `<a href=${link}><p>Click This Link To Reset Password!</p></a>`
    }

    transporter.sendMail(mailinfo, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log("Email Sent!")
        }
    })
  });

})
//<a href=${link}><p>Click This Link To Reset Password!</p></a>



router.post("/password-token/check/:id/:token", async (req,res) =>{
    const { id, token } = req.params;

    const secret = JWT_SECRET;
    try{
        const verify = jwt.verify(token, secret);
        const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      const q = "UPDATE users SET `password`=? WHERE user_id=? "
    
      db.query(q, [hash,id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("updated");
      });
    }catch (error) {
        res.send("Not Verfied!")
    }
})


export default router