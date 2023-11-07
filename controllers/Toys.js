import jwt from "jsonwebtoken";
import express, { json, response } from "express"
import redis from 'redis'
import { db } from "../db.js";
import util from 'util'



export const Get_all_kids = (req, res) => {
        
    const q = "SELECT * FROM msm_wcj.child_database_for_toys;"
     db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
  
  });
  };



  export const Addkid_for_toy = async (req, res) => {
    let uniqueID = Math.random().toString(36).replace(/[^a-z0-9]/gi,'').substr(2,10);
 
    const q = "INSERT INTO child_database_for_toys (`id`,`gender`,`age`,`Favorite color`,`Shirt Size`,`Pants Size`,`Shoe size`) VALUES (?)"
    const values = [
      uniqueID,
      req.body.gender,
      req.body.age,
      req.body.Favorite_color,
      req.body.Shirt_Size,
      req.body.Pants_Size,
      req.body.Shoe_size,
    
      
    ];

    db.query(q, [values], (err, data)=> {
      if(err) return res.json(err)
      return res.json("child has been added!")
    })
  }



  export const Get_kid_by_id = (req, res) => {
        
    const q = "SELECT * FROM msm_wcj.child_database_for_toys WHERE id=?;"
     db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data[0]);
  
  });
  };



  export const claim_kid_to_buy = (req, res) => {
        
    const q = "UPDATE msm_wcj.child_database_for_toys SET `Is_claimed`='true' WHERE id=?"
     db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("child has been claimed!");
  
  });
  };
