import express from "express"
import {Getworks, Getwork, Addwork} from "../controllers/work.js"

const router = express.Router()

router.get("/", Getworks)
router.get("/:id", Getwork)
router.post("/add", Addwork)







export default router