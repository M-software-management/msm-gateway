import { db } from "../db.js";
import jwt from "jsonwebtoken";
import { createClient } from 'redis';
import util from 'util'
import axios from 'axios';
import { v4 as uuidv4} from 'uuid'
import fs, { link } from 'fs'
import path from 'path';
import { dirname } from 'path';
const __dirname = path.resolve();
const filePath = path.join(__dirname, './controllers/test.html');

import WPAPI from "wpapi";
    const wp = new WPAPI({
       endpoint: "https://westcentralmnjobs.com/wp-json",
       username: 'nodejs-cli',
      password: 'EQo&ZK(#zNm4)Qf1XZ!EgHHz',
 });

 //export const Get_all_kids = async (req, res) => {
        
// const data_wp_test = await wp.get('posts')
 
 //     console.log(data_wp_test. _levels)
   //   return data_wp_test


//};
 

//const data_wp_test = await wp.post().get().then(function( response ) {
  // "response" will hold all properties of your newly-created post,
  // including the unique `id` the post was assigned on creation
  //console.log( response );
//})
//console.log(data_wp_test)


 
//const client = createClient({
  //url: 'redis://192.168.1.17:49199'
//})
  //await client.connect();

  //client.set = util.promisify(client.set)

  const ex = 3600


  //------------------------------------------------------------------------------------------------------------------------------------------
  
  const job_data_api_url = "https://sfhs.hcshiring.com/29038835/api/jobs?category=&distance=-1&filters=&internal=false&job=&jobSelected=false&location=&openOnly=false&orgId=&page=8"

  const job_data_api_url_with_page = "https://sfhs.hcshiring.com/29038835/api/jobs?category=&distance=-1&filters=&internal=false&job=&jobSelected=false&location=&openOnly=false&orgId=&page=8"


  export const Get_new_jobs = async (req, url ,res) => {

    const parsedResults = []
    var indexPage = 1
    var totalPage = 0
    
   var i
    for (let i = 0; i < 10; i++) {
     
    }
    const new_job_data = await axios.get(job_data_api_url); 
     //console.log(new_job_data.data.meta)
    // totalPage = page[page.length-1] 
    
  const good_data_almost = JSON.stringify(new_job_data.data)
  const good_json_good = JSON.parse(good_data_almost)
 
   
    const array = new_job_data.data.jobs;
     array.forEach(element => {

      const qw = "SELECT * FROM msm_wcj.jobs WHERE external_id=?";

      db.query(qw, [element.id], (err, data) => {
        
        
     // console.log(data)
  
      const uid = uuidv4()
      
      
       const q = "INSERT IGNORE INTO msm_wcj.jobs (`job_id`,`job_title`,`summary`,`organization`,`street`,`city`,`state`,`zip`,`external_id`) VALUES (?)"
      const values = [
      uid,
      element.job_title,
      element.summary,
      element.organization,
      element.street,
      element.city,
      element.state,
      element.zip,
     element.id
      
    ];
    
      db.query(q,[values], (err, data_24)=> {
       
       // console.log(data_24)


      });
      console.log(new_job_data.data.meta)
    return new_job_data.data.meta;
    })
    
    });
    
    };






    export const scrape_jobs_api = async (req,res) => {

      const parsedResults = []
      var indexPage = 10
      var totalPage = 22

      const job_data_api_url_with_page_22 = "https://sfhs.hcshiring.com/0d971156/api/jobs?category=&distance=-1&filters=&internal=false&job=&jobSelected=false&location=&openOnly=false&orgId=&page="

 var i
      for (i = 0; i < totalPage; i++) {

        const new_job_data = await axios.get(job_data_api_url_with_page_22 + indexPage); 
        console.log(new_job_data)
totalPage = new_job_data.data.meta.totalPages
const all_jobs = new_job_data.data.jobs
all_jobs.forEach(element => {

          const qw = "SELECT * FROM msm_wcj.jobs WHERE external_id=?";
    
          db.query(qw, [element.id], (err, data) => {
            //if(data.length==0){
                  //return res.status(200).json("job has already been added!");}
            
         // console.log(data)
      
          const uid = uuidv4()
          
          
           const q = "INSERT IGNORE INTO msm_wcj.jobs (`job_id`,`job_title`,`summary`,`organization`,`street`,`city`,`state`,`zip`,`external_id`) VALUES (?)"
          const values = [
          uid,
          element.job_title,
          element.summary,
          element.organization,
          element.street,
          element.city,
          element.state,
          element.zip,
         element.id
          
        ];
        
          db.query(q,[values], (err, data_24)=> {
           
           // console.log(data_24)
    


           return res.end("User has been created.");
          });
         
        })
        
        });
      }


    }
    
    









    export const Scrape_all_jobs_than_push = async (req,res) => {

      const parsedResults = []
      var indexPage = 1
      var totalPage = 1

      const job_data_api_url_with_page_22 = "https://sfhs.hcshiring.com/0d971156/api/jobs?category=&distance=-1&filters=&internal=false&job=&jobSelected=false&location=&openOnly=false&orgId=&page="

      var i
      for (i = 0; i < totalPage; i++) {
      const new_job_data = await axios.get(job_data_api_url_with_page_22 + indexPage); 
      
var indexPage
var totalPage
      indexPage = new_job_data.data.meta.page;
      totalPage = new_job_data.data.meta.totalPages;
      parsedResults.push(new_job_data.data.jobs)
      }

      console.dir(parsedResults);
      // Write countries array in countries.json file
      fs.writeFile("coutries.json", JSON.stringify(parsedResults, null, 2), (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Successfully written data to file");
      });



      
    }
   
































   

    export const trigger_sfhs_jobs_scrape = async (req, res) => {
      
    
    try{
      const res_2 = await Get_new_jobs(job_data_api_url)
      console.log(res_2)

     if(res_2.page<res_2.meta.totalPages){
        const res_2 = await Get_new_jobs(job_data_api_url_with_page + res_2.meta.page + 1)
        
      }
        }catch(err){

            console.log(err)
            if (err) return err
          }
          
          
          
          };
      
         
//------------------------------------------------------------------------------------------------------------------------------------------









export const Getshifts = (req, res) => {
  
  const q = req.query.location_id ? 
    "SELECT * FROM shifts WHERE location_id=? ORDER BY orders"
    :"SELECT * FROM sfhs.shifts ORDER BY orders";
  
    db.query(q,[req.query.location_id], (err, data)=> {
      if (err) return res.json(err)
      return res.status(200).json(data);
    
    });
  };



 // export const Getdata_from_wordpress = (req, res) => {
   // const token = { username: "admin", password: "XXX XXX XXX XXX" };
    //const post_data = {
      //title: "My First API Post",
      //content: "Hello world! This is my first post using the WordPress REST API.",
    //};
    
   // wp.posts()
     // .auth(token)
      //.create(post_data)
      //.then((response) => {
        //console.log("Article posted:", response);
      //})
      //.catch((error) => {
        //console.error(error);
      //});
    //};


    export const Getdata_from_test = async (req, res) => {
    try{

const res_data = await axios.post("https://westcentralmnjobs.com/wp-json/jwt-auth/v1/token",{
  username: "nodejs-cli",
  password:"EQo&ZK(#zNm4)Qf1XZ!EgHHz",
  headers: {
    Accept: "application/json",
    "User-Agent": "axios 0.21.1"
  }
})
 console.log(user.token)
        localStorage.setItem('jwt', user.token)
 return res.status(200).json(res_data);


    }catch(err){
      console.log(err)
    }
      };

      
  export const GetJobs = (req, res) => {
  
    const q =  "SELECT * FROM `msm_wcj`.jobs"
    
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
     
      const q =  "SELECT * FROM msm_wcj.jobs WHERE job_id=?"
        db.query(q,[req.params.id], (err, data)=> {
          if (err) return res.json(err)
          return res.status(200).json(data[0]);
       
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