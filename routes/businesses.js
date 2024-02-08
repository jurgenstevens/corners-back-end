import { Router } from "express"
import { checkAuth, decodeUserFromToken } from '../middleware/auth.js'
import * as businessCtrl from '../controllers/businesses.js'

const router = Router()
// this was what was missing vvv
router.use(decodeUserFromToken)
router.get("/", businessCtrl.index)
router.post("/register", checkAuth, businessCtrl.create)
router.delete("/:id", checkAuth, businessCtrl.delete)



export { router }