import express from "express"
import { Getnotification, Getnotificationtype, Mass_sms, SendMailAll, Send_alert, Getnotification_bell_number, Seen_nofi } from "../controllers/notification.js"
import {Adminonly, overlord} from "../jwtauth-role.js"
import Authtoken from "../jwtauth.js"

const router = express.Router()

router.get("/", Getnotification)
router.get("/type", Getnotificationtype)
router.get("/bell_number/badge", Getnotification_bell_number)
router.post("/email/:id", SendMailAll)
router.post("/sms/:id", Mass_sms)
router.post("/nofi/:id", Send_alert)
router.post("/seen/by_user", Seen_nofi)








export default router