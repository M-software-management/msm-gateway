import { db } from "../db.js";
import jwt from "jsonwebtoken";

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