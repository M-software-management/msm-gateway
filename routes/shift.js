import express from "express"
import {Getshifts, Addshift, deleteshift, Pickshift, Getrequest, Getshift, Updateshift, Approverequest, Getonerequest, Deleterequest, Getuserequest, GetshiftHide} from "../controllers/shift.js"
import {Adminonly, overlord} from "../jwtauth-role.js"
import Authtoken from "../jwtauth.js"

const router = express.Router()

router.get("/", Getshifts)
router.put("/acm/update/:id", Updateshift)
router.get("/s/:id", Getshift)
router.post("/acm/add", Addshift)
router.delete("/acm/:id", deleteshift);
router.post("/pick/:id", Pickshift);
router.get("/request", Authtoken,Getrequest)
router.put("/acm/request/approve/:id", Authtoken,Approverequest)
router.get("/request/:id", Authtoken ,Getonerequest)
router.delete("/acm/request/:id", Authtoken ,Deleterequest)
router.get("/activerequest", Getuserequest)




export default router