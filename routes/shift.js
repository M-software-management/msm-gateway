import express from "express"
import {Getshifts, Addshift, deleteshift, Pickshift} from "../controllers/shift.js"

const router = express.Router()

router.get("/", Getshifts)
router.post("/add", Addshift)
router.delete("/:id", deleteshift);
router.post("/pick", Pickshift);



export default router