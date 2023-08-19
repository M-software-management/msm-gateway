import { db } from "../db.js";
import jwt from "jsonwebtoken";
import { createClient } from 'redis';
import util from 'util'


//const client = createClient({
  //url: 'redis://192.168.1.17:49199'
//})
  //await client.connect();

  //client.set = util.promisify(client.set)

  const ex = 3600


export const Getshifts = (req, res) => {
  
  const q = req.query.location_id ? 
    "SELECT * FROM shifts WHERE location_id=? ORDER BY orders"
    :"SELECT * FROM sfhs.shifts ORDER BY orders";
  
    db.query(q,[req.query.location_id], (err, data)=> {
      if (err) return res.json(err)
      return res.status(200).json(data);
    
    });
  };

  export const GetJobs = (req, res) => {
  
    const q =  "SELECT * FROM `wcj-main`.jobs"
    
      db.query(q,[req.query.location_id], (err, data)=> {
        if (err) return res.json(err)
        return res.status(200).json(data);
      
      });
    };


  export const Addshift = (req, res) => {
    const token = req.cookies.access_token
      if(!token) return res.status(403).json("not authenticated!")
      
      jwt.verify(token,"msmtest", (err, userinfo)=>{
        if(err) return res.status(403).json("Token not vaild!")
    
    const q = "INSERT INTO shifts (`created_by`,`date`,`hours`,`desc`,`hide_shift`,`location_id`) VALUES (?)"
    const values = [
      userinfo.id,
      req.body.date,
      req.body.hours,
      req.body.description,
      req.body.hide_shift,
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
    const token = req.cookies.access_token
      if(!token) return res.status(403).json("not authenticated!")
      
      jwt.verify(token,"msmtest", (err, userinfo)=>{

        if(err) return res.status(403).json("Token not vaild!")
    const q = "SELECT * FROM request WHERE shift_id=? AND user_id=?";

    db.query(q, [req.params.id, userinfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length) return res.status(409).json("You Already Requested This Shift!");

    
    
    const q = "INSERT INTO request (`location_id`,`shift_id`,`user_id`) VALUES (?)"
    const values = [
      userinfo.work_id,
      req.params.id,
      userinfo.id,
    ];

    db.query(q, [values], (err, data)=> {
      if(err) return res.json("An Error has happened")
      return res.json("Shift request made!")
    })
    })
    })
  }


  export const Getrequest = (req, res) => {

    
    const q = "SELECT `request_id`, r.`location_id`, r.`shift_id`, r.`user_id`, r.`approved`, u.`username`, L.`Name`, `date` FROM request r join users u ON r.user_id=u.user_id join Location L on r.location_id=L.location_uid\ INNER JOIN shifts ON r.shift_id = shifts.shift_id WHERE r.location_id=? ";
    
      db.query(q,[req.params.id], (err, data)=> {
        if (err) return res.json(err)
        return res.status(200).json(data);
      });
    };

    export const Updateshift = (req, res) => {
      
      const q = "UPDATE shifts SET `date`=?,`hours`=?,`desc`=?,`hide_shift`=? WHERE shift_id=?"
  
      db.query(q, [req.body.date, req.body.hours, req.body.desc, req.body.hide,req.params.id], (err, data)=> {
        if(err) return res.json(err)
        return res.json("Shift has been update")
      })
    }

    export const Getshift = (req, res) => {
      const token = req.cookies.access_token
      if(!token) return res.status(403).json("not authenticated!")
      
      jwt.verify(token,"msmtest", (err, userinfo)=>{
        if(err) return res.status(403).json("Token not vaild!")
      
      const q =  "SELECT * FROM sfhs.shifts WHERE shift_id=?"
        db.query(q,[req.params.id], (err, data)=> {
          if (err) return res.json(err)
          return res.status(200).json(data[0]);
        })
        });
      };


      export const Approverequest = (req, res) => {
      
        const q = "UPDATE request SET `approved`= true WHERE request_id=?"
    
        db.query(q, [req.params.id], (err, data)=> {
          if(err) return res.json(err)
         
          
          const qw2 = 'SELECT * FROM sfhs.request WHERE request_id=?'
    
          db.query(qw2, [req.params.id], (err, data_2)=> {
            if(err) return res.json(err)
           
            
          

          const qw = `UPDATE shifts SET is_picked_up='true', picked_user_id=${data_2[0].user_id} WHERE shift_id=${data_2[0].shift_id}`
    
          db.query(qw, [req.params.id], (err, data_3)=> {
            if(err) return res.json(err)
            return res.json("Shift has been Approved")
          })
        })})
      }



      export const Getonerequest = (req, res) => {
        
        const q = "SELECT `request_id`, r.`location_id`, r.`shift_id`, r.`user_id`, r.`approved`, u.`username`, L.`Name`, `date` FROM request r join users u ON r.user_id=u.user_id join Location L on r.location_id=L.location_uid JOIN shifts ON r.shift_id = shifts.shift_id WHERE request_id=?";
        
          db.query(q,[req.params.id], (err, data)=> {
            if (err) return res.json(err)
            return res.status(200).json(data[0]);
          });
        };

        export const Deleterequest = (req, res) => {
              
          const q = "DELETE FROM request WHERE `request_id`= ?"
          db.query(q, [req.params.id], (err, data)=> {
            if(err) return res.json("An Error has happened")
            return res.json("Request has been Deleted")
          })
        }


        export const Getuserequest = (req, res) => {
        
          const q = "SELECT `request_id`, r.`location_id`, r.`shift_id`, r.`user_id`, r.`approved`, u.`username`, L.`Name`, `date` FROM request r join users u ON r.user_id=u.user_id join Location L on r.location_id=L.location_uid\ INNER JOIN shifts s ON r.shift_id = s.shift_id WHERE r.user_id=?";
          
            db.query(q,[req.query.user_id], (err, data)=> {
              if (err) return res.json(err)
              return res.status(200).json(data)
            });
          };


          export const GetshiftHide = (req, res) => {
            const token = req.cookies.access_token
            if(!token) return res.status(403).json("not authenticated!")
            
            jwt.verify(token,"msmtest", (err, userinfo)=>{
              if(err) return res.status(403).json("Token not vaild!")
            
            const q =  "SELECT `shift_id`,`hide_shift` FROM sfhs.shifts WHERE `hide_shift`= 1 AND shift_id=? "
              db.query(q,[req.params.id], (err, data)=> {
                if (err) return res.json(err)
                return res.status(200).json(data);
              })
              });
            };



          export const GetUsershifts = (req, res) => {
            const token = req.cookies.access_token
            if(!token) return res.status(403).json("not authenticated!")
            
            jwt.verify(token,"msmtest", (err, userinfo)=>{
              if(err) return res.status(403).json("Token not vaild!")
              let returnval = {}
              let error_selector = false
              let statusobj = {
                "message":"SUCCESS",
                "code": 200,
                "error": error_selector,
              }
            
            const q =  "SELECT * FROM sfhs.shifts WHERE `is_picked_up`='true' AND picked_user_id=? "
              db.query(q,[userinfo.id], (err, data)=> {
                returnval.data = data
                if (err) return res.json(err)
                if(data.length==0){
                  return res.status(200).json("You Have not been approved for any shifts!");}

                return res.status(200).json({data, "status":statusobj});
              })
              });
            };