import { Router } from "express"
import { checkAuth, decodeUserFromToken } from '../middleware/auth.js'
import * as businessCtrl from '../controllers/businesses.js'

const router = Router()
// this was what was missing vvv
router.use(decodeUserFromToken)
router.post("/register", checkAuth, businessCtrl.create)



export { router }