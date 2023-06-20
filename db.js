import mysql from "mysql"
import redis from 'redis'
import { createClient } from 'redis';
import util from 'util'
import * as fs from 'fs';
import express from 'express'

import * as dotenv from 'dotenv'
dotenv.config()


const url_redis = process.env.REDIS_URL

export const db = mysql.createConnection({
    host:"db-mysql-nyc1-11606-do-user-14262902-0.b.db.ondigitalocean.com",
    user:"adminnode",
    password:"AVNS_xhzJrc-Dr_BOeyxxZJZ",
    database:"sfhs",
    port: 25060,
    insecureAuth : true,
    ssl  : {
      ca : fs.readFileSync('./ca-certificate.crt'),
      
      
    }
    
    
})




export const client = createClient({
   url: "rediss://default:AVNS_A6Py-k5w_BK3pT2VIC2@db-redis-nyc1-68088-do-user-14262902-0.b.db.ondigitalocean.com:25061"
})
client.on('error', err => console.log('Redis Client Error', err));

  await client.connect();
  
  

  client.on('connect', function(err){
    console.log("Redis connected!")
  });


  

  