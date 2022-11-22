import express from "express"
import {Getusers, Getuser, updateuser, getself, deleteuser, Getuserwork} from "../controllers/user.js"
import {Adminonly, overlord} from "../jwtauth-role.js"
import Authtoken from '../jwtauth.js'

const router = express.Router()

router.get("/", overlord ,Getusers)
router.get("/:id", Adminonly,Getuser)
router.put("/acm/:id", updateuser)
router.get("/me/self", getself)
router.delete("/acm/:id", Authtoken ,Adminonly, deleteuser)
router.get("/work/all", Getuserwork)



export default router