import express from "express"
import {Getusers, Getuser, updateuser, getself} from "../controllers/user.js"
const router = express.Router()

router.get("/", Getusers)
router.get("/:id", Getuser)
router.put("/:id", updateuser)
router.get("/m/1", getself)



export default router