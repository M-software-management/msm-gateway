import express from "express"
import { Getnotification, Getnotificationtype } from "../controllers/notification.js"
import {Adminonly, overlord} from "../jwtauth-role.js"
import Authtoken from "../jwtauth.js"

const router = express.Router()

router.get("/", Getnotification)
router.get("/type", Getnotificationtype)




export default router