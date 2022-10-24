import express from "express"
import {Getshifts, Addshift, deleteshift} from "../controllers/shift.js"

const router = express.Router()

router.get("/", Getshifts)
router.post("/add", Addshift)
router.delete("/:id", deleteshift);



export default router