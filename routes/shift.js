import express from "express"
import {Getshifts, Addshift, deleteshift, Pickshift, Getrequest, Getshift, Updateshift, Approverequest, Getonerequest, Deleterequest, Getuserequest} from "../controllers/shift.js"
import {Adminonly, overlord} from "../jwtauth-role.js"
import Authtoken from "../jwtauth.js"

const router = express.Router()

router.get("/", Getshifts)
router.put("/update/:id", Updateshift)
router.get("/s/:id", Getshift)
router.post("/add", Addshift)
router.delete("/:id", deleteshift);
router.post("/pick/:id", Pickshift);
router.get("/request", Authtoken,Getrequest)
router.put("/request/approve/:id", Authtoken,Approverequest)
router.get("/request/:id", Authtoken ,Getonerequest)
router.delete("/request/:id", Authtoken ,Deleterequest)
router.get("/activerequest", Getuserequest)




export default router