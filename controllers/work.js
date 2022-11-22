import jwt from "jsonwebtoken";
import { db } from "../db.js";
import util from 'util'
import { createClient } from 'redis';


const client = createClient({
    url: 'redis://192.168.1.5:6379'
})
await client.connect();

client.set = util.promisify(client.set)



export const Getworks = (req, res) => {
        
        const q = "SELECT * FROM sfhs.Location WHERE hide=1;"
         db.query(q, [req.params.id], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
    
    });
  };


  export const Getworksadmin = (req, res) => {
        
    const q = "SELECT * FROM sfhs.Location;"
     db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);

});
};


  export const Getwork = (req, res) => {
    const q = "SELECT * FROM sfhs.Location WHERE location_uid=?;"
  
    db.query(q, [req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data[0]);
    });
  };


  export const Addwork = (req, res) => {
    const token = req.cookies.access_token
      if(!token) return res.status(403).json("not authenticated!")
      
      jwt.verify(token,"msmtest", (err, userinfo)=>{
        if(err) return res.status(403).json("Token not vaild!")
    
    const q = "INSERT INTO sfhs.Location (`Name`,`banner`,`admin_id`) VALUES (?)"
    const values = [
      req.body.name,
      req.body.banner,
      req.body.admin,
    ];

    db.query(q, [values], (err, data)=> {
      if(err) return res.json(err)
      return res.json("Location has been created")
    })
    })
  }

  export const geturl = (req, res) => {
    const q =  "SELECT * FROM sfhs.Location WHERE slug=?;"
  
    db.query(q, [req.params.slug], (err, data) => {
      if (err) return res.status(500).json(err);
  
      return res.status(200).json(data[0]);
    });
  };


  export const updatework = (req, res) => {
    const q = "UPDATE Location SET `name`=?,`banner`=?,`pfp`=?,`admin_id`=?,`slug`=?,`hide`=? WHERE location_uid=? "
  
    db.query(q, [req.body.name,req.body.banner,req.body.pfp,req.body.admin,req.body.slug,req.body.hide,req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
  
      return res.status(200).json("updated");
    });
  };


  export const deletework = (req, res) => {
        
    const q = "DELETE FROM sfhs.Location WHERE `location_uid`= ?"
    db.query(q, [req.params.id], (err, data)=> {
      if(err) return res.json(err)
      return res.json("Work has been Deleted")
    })
  }