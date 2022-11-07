import express from "express"
import {Getshifts, Addshift, deleteshift, Pickshift, Getrequest, Getshift, Updateshift} from "../controllers/shift.js"
import {Adminonly, overlord} from "../jwtauth-role.js"

const router = express.Router()

router.get("/", Getshifts)
router.put("/update/:id", Updateshift)
router.get("/s/:id", Getshift)
router.post("/add", Addshift)
router.delete("/:id", deleteshift);
router.post("/pick/:id", Pickshift);
router.get("/request", Getrequest)
router.put("/update/:id", Updateshift)



export default router