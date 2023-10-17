import { Router } from "express"
import { checkAuth } from '../middleware/auth.js'
import * as businessCtrl from '../controllers/businesses.js'

const router = Router()

router.post("/register", checkAuth, businessCtrl.create)


export { router }