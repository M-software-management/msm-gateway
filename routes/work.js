import express from "express"
import {Getworks, Getwork, Addwork, geturl} from "../controllers/work.js"
import Authtoken from "../jwtauth.js"
import {Adminonly, overlord} from "../jwtauth-role.js"
import { updatework } from "../controllers/work.js"

const router = express.Router()

router.get("/", Authtoken, Getworks)
router.get("/:id", Getwork)
router.get("/info/:slug", Authtoken, geturl)
router.post("/add", Addwork)
router.put("/:id", updatework)







export default router