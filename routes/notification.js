import express from "express"
import { Getnotification, Getnotificationtype, Mass_sms, SendMailAll, Send_alert } from "../controllers/notification.js"
import {Adminonly, overlord} from "../jwtauth-role.js"
import Authtoken from "../jwtauth.js"

const router = express.Router()

router.get("/", Getnotification)
router.get("/type", Getnotificationtype)
router.post("/email/:id", SendMailAll)
router.post("/sms/:id", Mass_sms)
router.post("/nofi/:id", Send_alert)




export default router