import express from "express"
import {Getworks, Getwork, Addwork, geturl, deletework, Getworksadmin, getshifturl, arraytest, Array_2_test} from "../controllers/work.js"
import Authtoken from "../jwtauth.js"
import {Adminonly, overlord} from "../jwtauth-role.js"
import { updatework } from "../controllers/work.js"
import multer from 'multer'

const router = express.Router()


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });
  
  const upload = multer({ storage });

router.get("/", Getworks)
router.get("/:id", Getwork)
router.get("/info/:slug", geturl)
router.post("/acm/add", upload.single('file') ,Addwork)
router.put("/acm/:id", updatework)
router.delete("/acm/:id", deletework)
router.get("/acm/all", Authtoken, Getworksadmin)
router.get("/shifts/:url", getshifturl)
router.get("/shift/test/:id", arraytest)
router.get("/shift/:id", Array_2_test)






export default router