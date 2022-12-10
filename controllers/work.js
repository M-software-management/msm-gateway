import jwt from "jsonwebtoken";
import express, { response } from "express"
import redis from 'redis'
import { db } from "../db.js";
import util from 'util'
import { createClient } from 'redis';


const client = createClient({
   url: 'redis://192.168.1.5:6379'
})
  await client.connect();

  client.set = util.promisify(client.set)

  const ex = 3600


export const Getworks = async (req, res) => {
  const cachedResponse = await client.get(`work-all`);
    
  if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse))
     } else {
      console.log(`Cache miss for work`);
        
        const q = "SELECT * FROM sfhs.Location WHERE hide=1;"
         db.query(q, [req.params.id], (err, data) => {
            if (err) return res.status(500).json(err);
            client.set('work-all',JSON.stringify(data),{
              EX: ex,
            })
            return res.status(200).json(data);
    
    });}
  };


  export const Getworksadmin = (req, res) => {
        
    const q = "SELECT * FROM sfhs.Location;"
     db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);

});
};


  export const Getwork = async (req, res) => {
    const  id  = req.params.id;
    const cachedResponse = await client.get(`work-${id}`);
    
       if (cachedResponse) {
             return res.json(JSON.parse(cachedResponse))
          } else {
           console.log(`Cache miss for work`);
    const  id  = req.params.id;
    const q = "SELECT * FROM sfhs.Location WHERE location_uid=?;"
  
    db.query(q, [req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      client.set(`work-${id}`, JSON.stringify(data),{
        EX: ex,
      })
      return res.status(200).json(data[0]);
    });}
  };


  export const Addwork = (req, res) => {
    
    const q = "INSERT INTO sfhs.Location (`Name`,`banner`,`admin_id`) VALUES (?)"
    const values = [
      req.body.name,
      req.file.path,
      req.body.admin,
    ];

    db.query(q, [values], (err, data)=> {
      if(err) return res.json(err)
      return res.json("Location has been created")
    })
  }

  export const geturl = async (req, res) => {
    const cachedResponse = await client.get(`work-${req.params.slug}`);
    
    if (cachedResponse) {
          return res.json(JSON.parse(cachedResponse))
       } else {
        console.log(`Cache miss for work`);
    const q =  "SELECT * FROM sfhs.Location WHERE slug=?;"
  
    db.query(q, [req.params.slug], (err, data) => {
      if (err) return res.status(500).json(err);
      client.set(`work-${req.params.slug}`, JSON.stringify(data),{
        EX: ex,
      })
      return res.status(200).json(data[0]);
    });}
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




  export const getshifturl = async (req, res) => {
    const cachedResponse = await client.get(`work-${req.params.url}-shifts`);
    
  if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse))
     } else {
      console.log(`Cache miss for work`);
    const q =  "SELECT s.* FROM sfhs.Location L JOIN sfhs.shifts s ON s.location_id=L.location_uid WHERE slug=? AND hide_shift=1;"
  
    db.query(q, [req.params.url], (err, data) => {
      if (err) return res.status(500).json(err);
      client.set(`work-${req.params.url}-shifts`, JSON.stringify(data),{
        EX: ex,
      })
      return res.status(200).json(data);
    });}
  };