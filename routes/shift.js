import express from "express"
import {Getshifts, Addshift, deleteshift, Pickshift, Getrequest, Getshift, Updateshift, Approverequest, Getonerequest, Deleterequest, Getuserequest, GetshiftHide, Getdata_from_test, GetUsershifts, GetJobs, Get_new_jobs, trigger_sfhs_jobs_scrape} from "../controllers/shift.js"
import {Adminonly, overlord} from "../jwtauth-role.js"
import Authtoken from "../jwtauth.js"
import { GetJobs_by_id } from "../controllers/Scraping.js"

const router = express.Router()

router.get("/", GetJobs)
router.get("/id/:id", GetJobs_by_id)

router.get("/test_new/get/data/jobs/test/long_url", trigger_sfhs_jobs_scrape)
router.get("/test_new/get/data/jobs/test/post/to/wordpress", Getdata_from_test)
router.put("/acm/update/:id", Updateshift)
router.get("/s/:id", Getshift)
router.post("/acm/add", Addshift)
router.delete("/acm/:id", deleteshift);
router.post("/pick/:id", Pickshift);
router.get("/request/:id", Getrequest)
router.put("/acm/request/approve/:id", Authtoken,Approverequest)
router.get("/request/:id", Authtoken ,Getonerequest)
router.delete("/acm/request/:id", Authtoken ,Deleterequest)
router.get("/activerequest", Getuserequest)
router.get("/me_picked", GetUsershifts)




export default router