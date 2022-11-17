import express from "express"
import {Getworks, Getwork, Addwork, geturl, deletework} from "../controllers/work.js"
import Authtoken from "../jwtauth.js"
import {Adminonly, overlord} from "../jwtauth-role.js"
import { updatework } from "../controllers/work.js"
import { Cache } from "../redis.js"

const router = express.Router()

router.get("/", Authtoken, Getworks)
router.get("/:id", Getwork)
router.get("/info/:slug", Authtoken, geturl)
router.post("/acm/add", Addwork)
router.put("/acm/:id", updatework)
router.delete("/acm/:id", deletework)







export default router