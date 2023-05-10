import nodemailer from 'nodemailer'


export const transporter = nodemailer.createTransport({
    host: process.env.host_email_server,
    port: process.env.email_smtp_port,
    auth:{
        user: process.env.auth_email_username,
        pass: process.env.auth_email_password,
    }
})



