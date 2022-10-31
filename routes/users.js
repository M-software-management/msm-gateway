import express from "express"
import {Getusers, Getuser, updateuser} from "../controllers/user.js"
const router = express.Router()

router.get("/", Getusers)
router.get("/:id", Getuser)
router.put("/:id", updateuser)




export default router