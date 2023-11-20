import express from "express"
import { Get_all_events_test, Mass_insert_events} from "../controllers/Events.js"
import {Adminonly, overlord} from "../jwtauth-role.js"
import Authtoken from "../jwtauth.js"

const router = express.Router()

router.get("/", Get_all_events_test)
router.post("/event_ingest", Mass_insert_events)






export default router