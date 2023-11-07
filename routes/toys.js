import express from "express"
import {Get_all_kids, Addkid_for_toy, Get_kid_by_id, claim_kid_to_buy} from "../controllers/Toys.js"
import {Adminonly, overlord} from "../jwtauth-role.js"
import Authtoken from "../jwtauth.js"

const router = express.Router()

router.get("/", Get_all_kids)
router.post("/add_new_kid", Addkid_for_toy)
router.get("/:id", Get_kid_by_id)
router.post("/claim/:id", claim_kid_to_buy)





export default router