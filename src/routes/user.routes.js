import {Router} from "express" ;
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"


const router = Router() ;

router.route("/register").post(
    upload.fields(
        [
            { name: "avatar", maxCount: 1},
            { name: "coverImage", maxCount: 1}
        ]
    ),    

    registerUser
);
router.route("/login").post(loginUser)


// Secured Routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken) // verifyJWT is not required because I check the user's existence inside of the function, but we can use it as well.



export default router ;




// maxCount --> The maximum number of files allowed for that field.