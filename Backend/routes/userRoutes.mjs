import express from "express"
import tokenVerification from "../middleware/tokenVerification.mjs"
import { signUp, logIn} from "../controller/userController.mjs"
const router = express.Router()

router.post('/signup', signUp)
router.post('/login', logIn)
// router.post('/forget', forget)
// router.get('/resetpassword/:id/:token', resetPassword)

export default router