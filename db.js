import mysql from "mysql"
import redis from 'redis'
import { createClient } from 'redis';
import util from 'util'

export const db = mysql.createConnection({
    host:"192.168.1.17",
    user:"nodejs",
    password:"node1234",
    database:"sfhs",
    
    
    
})


export const client = createClient({
   url: 'redis://192.168.1.17:49199'
})
  await client.connect();
  
  client.on('connect', () => {
    console.log('Client connected to redis...')
  })
  
  client.on('ready', () => {
    console.log('Client connected to redis and ready to use...')
  })
  
  client.on('error', (err) => {
    console.log(err.message)
  })
  
  client.on('end', () => {
    console.log('Client disconnected from redis')
  })
  
  process.on('SIGINT', () => {
    client.quit()
  })

  