import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const Getusers = (req, res) => {
  const token = req.cookies.access_token
  if(!token) return res.status(403).json("not authenticated!")
  
  jwt.verify(token,"msmtest", (err, userinfo)=>{
    if(err) return res.status(403).json("Token not vaild!")
  const q = req.query.Work_location ? 
  "SELECT `user_id`,`username`,`email`,`role` FROM sfhs.users WHERE work_location=?;"
  :"SELECT `user_id`,`username`,`email`,`role` FROM sfhs.users";

  db.query(q, [req.query.Work_location], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  })
  });
  };


  export const Getuser = (req, res) => {
    const token = req.cookies.access_token
  if(!token) return res.status(403).json("not authenticated!")
  
  jwt.verify(token,"msmtest", (err, userinfo)=>{
    if(err) return res.status(403).json("Token not vaild!")

    const q = "SELECT * FROM sfhs.users WHERE user_id=?;"
  
    db.query(q, [req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      const { password, ...info } = data[0]
      return res.status(200).json(info);
    })
    });
  };


  export const updateuser = (req, res) => {
    const token = req.cookies.access_token
  if(!token) return res.status(403).json("not authenticated!")
  
  jwt.verify(token,"msmtest", (err, userinfo)=>{
    if(err) return res.status(403).json("Token not vaild!")
    
    //const salt = bcrypt.genSaltSync(10);
      //const hash = bcrypt.hashSync(req.body.password, salt);
    const q = "UPDATE users SET `username`=?,`email`=? WHERE user_id=? "
  
    db.query(q, [req.body.username,req.body.email,req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
  
      return res.status(200).json("updated");
    })
    });
  };


  export const updateuserNOT = (req, res) => {
    const token = req.cookies.access_token
  if(!token) return res.status(403).json("not authenticated!")
  
  jwt.verify(token,"msmtest", (err, userinfo)=>{
    if(err) return res.status(403).json("Token not vaild!")
    
    const q = "UPDATE users SET `email_notfi`=?,`sms_notfi`=? WHERE user_id=? "
  
    db.query(q, [req.body.email_notfi,req.body.sms_notfi,userinfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
  
      return res.status(200).json("updated");
    })
    });
  };




  export const getself = (req, res) => {
    const token = req.cookies.access_token
  if(!token) return res.status(403).json("not authenticated!")
  
  jwt.verify(token,"msmtest", (err, userinfo)=>{
    if(err) return res.status(403).json("Token not vaild!")

    const q = "SELECT * FROM sfhs.users WHERE `user_id` = ? ;"
  
    db.query(q, [userinfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      const { password, ...info } = data[0]
      return res.status(200).json(info);
    })
    });
  };

  export const deleteuser = (req, res) => {
        
    const q = "DELETE FROM users WHERE `user_id`= ?"
    db.query(q, [req.params.id], (err, data)=> {
      if(err) return res.json(err)
      return res.json("User has been Deleted")
    })
  }


  export const Getuserwork = (req, res) => {
    const token = req.cookies.access_token
  if(!token) return res.status(403).json("not authenticated!")
  
  jwt.verify(token,"msmtest", (err, userinfo)=>{
    if(err) return res.status(403).json("Token not vaild!")

    const q = "SELECT `Work_location`, `Name`, `banner`, `slug`, `hide` FROM users u JOIN Location L ON u.Work_location=L.location_uid WHERE user_id=?;"
  
    db.query(q, [userinfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    })
    });
  };


  export const Getuseremail = (req, res) => {

    const q = "SELECT * FROM sfhs.users WHERE email=?;"
  
    db.query(q, [req.params.email], (err, data) => {
      if (err) return res.status(500).json(err);
      const { password, ...info } = data[0]
      return res.status(200).json(info);
    });
  };

  export const Getallworkuser = (req, res) => {
    const token = req.cookies.access_token
    if(!token) return res.status(403).json("not authenticated!")
    
    jwt.verify(token,"msmtest", (err, userinfo)=>{
      if(err) return res.status(403).json("Token not vaild!")
    const q = 
    "SELECT `email` FROM sfhs.users WHERE work_location=?";
  
    db.query(q, [req.query.Work_location], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    })
    });
    };




    export const Getuserrmsr = (req, res) => {

      const q = "SELECT `user_id` FROM request WHERE shift_id=?;"
    
      db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    };

    export const Getgroup = (req, res) => {

      const q = "SELECT * FROM sfhs.group G RIGHT JOIN sfhs.group_values V ON G.g_id=V.group_id WHERE g_id=? "
    
      db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    };



    export const Getgroup_2 = async(req, res) => {

  
    
    
    
      const myquery = `SELECT * FROM sfhs.group G RIGHT JOIN sfhs.group_values V ON G.g_id=V.group_id JOIN sfhs.users U ON V.user_id=U.user_id WHERE g_id='1'`
    
    db.query(myquery,[req], function(err, results, fields) {
      if (err) {
          console.log('----> Error with MySQL query in /api/showSkills: ' + err.message);
      }
      else{
          console.log('Query successful, results are being displayed.');
          
    
          var mylist = [];
          var subcat = [];
          var lastPushedId = 0;
          for (let key in results){
              if(lastPushedId !== results[key].g_id){
                  for (let otherkey in results){
                      if(results[otherkey].group_id === results[key].g_id){
    
                          subcat.push({
      
                              'User_id': results[otherkey]?.user_id,
                              'email': results[otherkey]?.email,
                              
        
                          });
                         
                          
                        
                         
                      }
                  }
                  mylist.push({
                      'Group_id': results[key].g_id,
                      'name': results[key].name,
                      'user': subcat,
                  });
    
                  subcat = [];
                  lastPushedId = results[key].g_id;
                  
              }
          }
          return res.status(200).json(mylist)
          
      }
    });
    
    }