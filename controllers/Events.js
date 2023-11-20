import jwt from "jsonwebtoken";
import express, { json, response } from "express"
import redis from 'redis'
import { db } from "../db.js";
import util from 'util'






//test code to return a array of events

export const Get_all_events_test = (req, res) => {
    
   
    const q = "SELECT * FROM msm_wcj.data_analytics;"
     db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
  
  });


  };



  export const Mass_insert_events = (req, res) => {
    
   

    req.body.forEach(element => {

     const q = "INSERT IGNORE INTO msm_wcj.data_analytics (`id`,`event_type`,`triggered_on`,`identity_user_id`,`is_logged_in`,`event_namespace_page`,`event_namespace_page_url`,`event_namespace_component`,`event_namespace_element`,`event_namespace_action`,`event_namespace_client`,`client_app_id`) VALUES (?)"
      const values = [
        element.id,
      element.event_type,
      element.triggered_on,
      element.identity_user_id,
      element.is_logged_in,
      element.event_namespace_page,
      element.event_namespace_page_url,
      element.event_namespace_component,
     element.event_namespace_element,
     element.event_namespace_action,
     element.event_namespace_client,
     element.client_app_id,
      
    ];
     db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        
        return res.end(`${data.affectedRows} Event's were inserted successfully`);
  
  });

})
  };
