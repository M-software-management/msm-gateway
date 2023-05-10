import { db } from "../db.js";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'
import { default as twilio } from 'twilio'


const accountSid = 'ACe25f25d3abe5a9dca83af52ca425e0af';
const authToken = '3503fb6a80418c4721352884f0bcb450';
const client = twilio(accountSid, authToken);

export const Getnotification = (req, res) => {
  
  const q = "SELECT * FROM sfhs.Notifications WHERE `sent`=0  "
  
    db.query(q,[req.params.id], (err, data)=> {
      if (err) return res.json(err)
      return res.status(200).json(data);
    
    });
  };

  
  export const Getnotificationtype = (req, res) => {
  
    const q = "SELECT * FROM sfhs.Notifications WHERE `type`=? AND `sent`=? "
    
      db.query(q,[req.query.type,req.query.sent], (err, data)=> {
        if (err) return res.json(err)
        return res.status(200).json(data);
      
      });
    };



    export const SendMailAll = async (id,text,req,res) =>{
      
  
      try{
        const q = "SELECT `email` FROM sfhs.group G RIGHT JOIN sfhs.group_values V ON G.g_id=V.group_id JOIN sfhs.users U ON V.user_id=U.user_id WHERE g_id=? AND email_notfi='1'"
        db.query(q, [id], (err, data)=> {
          if(err) return res.json(err)
          
       
             
              if(data.length > 0 ){
                  const email = [];
                  data.map((key)=>{
                      email.push(key.email)
                      const mailinfo = {
                          from: "SFHS Alerts! <contact@jeremymichaelsontreeservice.com>",
                          to: key.email,
                          subject: "Alert!",
                          text: text,                    
                      }
                      transporter.sendMail(mailinfo, function(error, info){
                          if (error) {
                              console.log(error);
                          } else {
                              console.log("Email Sent!")
                          }
                      })
                  });
                  
                  return data
              } })
      }catch(err){
          console.log(err)
      }
  }
  
  const transporter = nodemailer.createTransport({
      host: "m16.siteground.biz",
      port: 465,
      auth:{
          user:"contact@jeremymichaelsontreeservice.com",
          pass:"Logan2022",
      }
  })
  
export const Mass_sms = (id,text,req, res) => {
 const q = "SELECT `phone_number` FROM sfhs.group G RIGHT JOIN sfhs.group_values V ON G.g_id=V.group_id JOIN sfhs.users U ON V.user_id=U.user_id WHERE g_id=? AND sms_notfi='1'"
    
      db.query(q,[id], (err, data)=> {
        if (err) return res.json(err)
        console.log(data)
        
        

  data.forEach(async data => {
    const message = await client.messages.create({
      body: text,
      from: '+18449573643',
      to: data.phone_number
    });
    console.log(message.status)
  });

  
  return "hello"
    
        
      
      });
    };


    export const Send_alert = (req, res) => {
  const id = req.params.id;
  const text = req.body.text;
  const email = req.query.email
  const sms = req.query.sms
try{
  if(email=='true'){
      SendMailAll(id,text)
      
    }

      if(sms=='true'){
      Mass_sms(id,text)
      
      }
      return res.json("everything Sent!");}
      catch(err){
        console.log(err)
      }
      };
  