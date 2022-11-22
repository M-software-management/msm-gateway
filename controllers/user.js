import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const Getusers = (req, res) => {
  const token = req.cookies.access_token
  if(!token) return res.status(403).json("not authenticated!")
  
  jwt.verify(token,"msmtest", (err, userinfo)=>{
    if(err) return res.status(403).json("Token not vaild!")
  const q = req.query.Work_location ? 
  "SELECT `username`,`email`,`role` FROM sfhs.users WHERE work_location=?;"
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
    
    const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
    const q = "UPDATE users SET `username`=?,`email`=?,`password`=?,`role`=? WHERE user_id=? "
  
    db.query(q, [req.body.username,req.body.email,hash,req.body.role,req.params.id], (err, data) => {
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