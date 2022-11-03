import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const Getshifts = (req, res) => {
  const token = req.cookies.access_token
  if(!token) return res.status(403).json("not authenticated!")
  
  jwt.verify(token,"msmtest", (err, userinfo)=>{
    if(err) return res.status(403).json("Token not vaild!")
  
  const q = req.query.location_id ? 
    "SELECT * FROM sfhs.shifts WHERE location_id=?"
    :"SELECT * FROM sfhs.shifts";
  
    db.query(q,[req.query.location_id], (err, data)=> {
      if (err) return res.json(err)
      return res.status(200).json(data);
    })
    });
  };


  export const Addshift = (req, res) => {
    const token = req.cookies.access_token
      if(!token) return res.status(403).json("not authenticated!")
      
      jwt.verify(token,"msmtest", (err, userinfo)=>{
        if(err) return res.status(403).json("Token not vaild!")
    
    const q = "INSERT INTO shifts (`date`,`hours`,`desc`,`location_id`) VALUES (?)"
    const values = [
      req.body.date,
      req.body.hours,
      req.body.description,
      req.body.location,
    ];

    db.query(q, [values], (err, data)=> {
      if(err) return res.json("An Error has happened")
      return res.json("Shift has been created")
    })
    })
  }


  export const deleteshift = (req, res) => {
    const token = req.cookies.access_token
      if(!token) return res.status(403).json("not authenticated!")
      
      jwt.verify(token,"msmtest", (err, userinfo)=>{
        if(err) return res.status(403).json("Token not vaild!")
        
    const q = "DELETE FROM shifts WHERE `shift_id`= ?"
    db.query(q, [req.params.id], (err, data)=> {
      if(err) return res.json("An Error has happened")
      return res.json("Shift has been Deleted")
    })
    })
  }

  export const Pickshift = (req, res) => {
    const q = "INSERT INTO shift-request (`shift_id`,`user_id`) VALUES ?"
    const values = [
      req.body.shift_id,
      req.userinfo.id,
    ]

    db.query(q, [values], (err, data)=> {
      if(err) return res.json("An Error has happened")
      return res.json("Shift request made!")
    })
  }