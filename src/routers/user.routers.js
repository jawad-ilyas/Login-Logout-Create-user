import { Router } from "express";
import { LoginUser, logoutUser, registerUser } from "../contollers/user.contollers.js";
import { upload } from "../middlerwares/multer.middlerware.js";
import { verifyJWT } from "../middlerwares/auth.middlerware.js";


const router = Router();

// user router register end point
router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }, {
        name: "coverImage",
        maxCount: 2
    }
]), registerUser)

// user router login In end point

router.route("/login").post(LoginUser)


// secure routes

router.route("/logout").post(verifyJWT,logoutUser)
export default router;