import express from "express"
import {Getusers, Getuser, updateuser, getself} from "../controllers/user.js"
import {Adminonly, overlord} from "../jwtauth-role.js"

const router = express.Router()

router.get("/", overlord ,Getusers)
router.get("/:id", Getuser)
router.put("/:id", updateuser)
router.get("/me/self", getself)



export default router