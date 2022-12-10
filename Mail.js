import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    host: "m16.siteground.biz",
    port: 465,
    auth:{
        user:"contact@jeremymichaelsontreeservice.com",
        pass:"contact2022",
    }
})



export default Mail