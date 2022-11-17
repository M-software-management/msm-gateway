import express, { response } from "express"
import redis from 'redis'
import util, { promisify } from 'util'
import { createClient } from 'redis';
import { Getwork } from "./controllers/work.js";

const router = express.Router()

const app = express();

const client = createClient({
    url: 'redis://192.168.1.5:6379'
})
await client.connect();

client.set = util.promisify(client.set)


export const Cache = async (req, res, next, data) =>{
    const { id } = req.params
      const cachedResponse = await client.get(`work-${id}`);
    
      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse))
      } else {
        console.log(`Cache miss for ${id}`);
        client.set(`work-${id}`, res.json(data))
        next();
      }
}

export const SetCache = async (req, res, next) =>{
    const { id } = req.params.id
    re
    client.set(`work-${id}`, JSON.stringify("hello"))
    next();
}


router.get("/work/:id" ,async (req,res) =>{
    const { id } = req.params
    const cachedWork = await client.get(`work-${id}`) 

    if(cachedWork){
        return res.json(JSON.parse(cachedWork))
    }

    const response = (Getwork) ;
    client.set(`work-${id}`, JSON.stringify(response.data))
    return res.json(response.data)
})





export default router;