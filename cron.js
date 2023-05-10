import { createConnection } from 'mysql'
import nodemailer from 'nodemailer'
import cron from 'cron'
import axios from 'axios'
import {Getgroup_2} from './controllers/user.js'
import {db} from './db.js'
import { transporter } from './Mail.js'


const q = "SELECT * FROM sfhs.group G RIGHT JOIN sfhs.group_values V ON G.g_id=V.group_id JOIN sfhs.users U ON V.user_id=U.user_id WHERE g_id='1'"

export const SendMailAll = async (req,res) =>{
  
    try{
      const q = "SELECT `email` FROM sfhs.group G RIGHT JOIN sfhs.group_values V ON G.g_id=V.group_id JOIN sfhs.users U ON V.user_id=U.user_id WHERE g_id='1' AND email_notfi='1'"
      db.query(q, [req.params.id], (err, data)=> {
        if(err) return res.json(err)
        
     
           
            if(data.length > 0 ){
                const email = [];
                data.map((key)=>{
                    email.push(key.email)
                    const mailinfo = {
                        from: "SFHS Alerts! <contact@jeremymichaelsontreeservice.com>",
                        to: key.email,
                        subject: "Alert!",
                        text: req.body.text,                    
                    }
                    transporter.sendMail(mailinfo, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Email Sent!")
                        }
                    })
                });
                
                return res.status(200).json("Sent!")
            } })
    }catch(err){
        console.log(err)
    }
}


