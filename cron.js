import { createConnection } from 'mysql'
import nodemailer from 'nodemailer'
import cron from 'cron'
import axios from 'axios'



export const SendMailAll = async () =>{
    try{
            const user =  await axios.get("https://jsonplaceholder.typicode.com/users")
            if(user.length > 0 ){
                const email = [];
                user.map((key)=>{
                    email.push(key.id)
                    console.log(key)
                });
                console.log(email)
            }
    }catch(err){
        console.log(err)
    }
}
