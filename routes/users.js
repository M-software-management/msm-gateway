import express from "express"
import {Getusers, Getuser} from "../controllers/user.js"

const router = express.Router()

router.get("/", Getusers)
router.get("/:id", Getuser)



export default router