import express from 'express'
import authroutes from "./routes/auth.js"
import usersroutes from "./routes/users.js"
import workroutes from "./routes/work.js"
import shiftroutes from "./routes/shift.js"
import notificationroutes from "./routes/notification.js"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import Authtoken from './jwtauth.js'
import nodemailer from 'nodemailer'
import { Getallworkuser } from './controllers/user.js'
import cron from 'cron'
import {SendMailAll} from './cron.js'
import { logger } from './config/logger.js'
import rateLimit from 'express-rate-limit'
import path from 'path'
import * as dotenv from 'dotenv'
dotenv.config()
import { transporter } from './Mail.js'
//import { client } from './db.js'
import { scrapeData } from './controllers/Scraping.js'

import { graphqlHTTP } from 'express-graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'

import { buildSchema } from "graphql";
import Toyroutes from './routes/toys.js'
import Eventsroutes from './routes/events.js'



const app = express();

const port = process.env.PORT || 8800;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(limiter)

app.use(logger)

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Credentials", true)
    next()
})


const imagesData = [
  {
    id: 1,
    title: "Stacked Brwonies",
    owner: "Ella Olson",
    category: "Desserts",
    url: "https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg",
  },
  {
    id: 2,
    title: "Shallow focus photography of Cafe Latte",
    owner: "Kevin Menajang",
    category: "Coffee",
    url: "https://images.pexels.com/photos/982612/pexels-photo-982612.jpeg",
  },
  {
    id: 3,
    title: "Sliced Cake on White Saucer",
    owner: "Quang Nguyen Vinh",
    category: "Desserts",
    url: "https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg",
  },
  {
    id: 4,
    title: "Beverage breakfast brewed coffee caffeine",
    owner: "Burst",
    category: "Coffee",
    url: "https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg",
  },
  {
    id: 5,
    title: "Pancake with Sliced Strawberry",
    owner: "Ash",
    category: "Desserts",
    url: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
  },
];


const schema = buildSchema(`
      type Query {
        image(id: Int!): Image
        images(category: String): [Image]
      }
      type Image {
        id: Int
        title: String
        category: String
        owner: String
        url: String
      }
`);


function getImage(args) {
  for (const image of imagesData) {
    if (image.id === args.id) {
      return image;
    }
  }
}

//Get images using category

function getImages(args) {
  if (args.category) {
    return imagesData.filter(
      (image) => image.category.toLowerCase() === args.category.toLowerCase()
    );
  } else {
    return imagesData;
  }
}

const root = {
  image: getImage,
  images: getImages,
};




app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
   
    graphiql: true,
  })
);


app.get('/', async (_req, res, _next) => {

  const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now()
  };
  try {
      res.send(healthcheck);
  } catch (error) {
      healthcheck.message = error;
      res.status(503).send();
  }
});
//app.use((err, req, res, next) => {
  //console.error(err);
  //res.status(500).json({error: 'an error occurred'});
//});
app.use(cors({}));
app.use(express.json());
app.use(cookieParser());
app.use("/v1/auth", authroutes)
app.use("/v1/user", usersroutes)
app.use("/v1/work", workroutes)
app.use("/v1/job", shiftroutes)
app.use("/v1/toy", Toyroutes)
app.use("/v1/event", Eventsroutes)
app.use("/v1/notification", notificationroutes)
app.use("/uploads", express.static("./uploads"))
app.post("/cron/:id", SendMailAll)
app.get("/hello", (req,res)=>{
  console.log("lots of code")
  redisdata = client.get("test")
  res.status(200).json(redisdata)

})



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });


app.post('/v1/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  res.status(200).json(process.env.api_url + '/uploads/' + file.filename);
})




app.post("/v1/email-api", (req,res) => {
  const text = req.body.text;
  const subject = req.body.subject;
  const people  = req.body.to;
  res.send("Email Sent!")
  const mailinfo = {
    from: process.env.email_from,
    to: people,
    subject: subject,
    text: text,
  

}

transporter.sendMail(mailinfo, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log("Email Sent!")
    }
})
})





app.listen(port, () => {
    console.log(`connected to backend! On port ${port}`)
});