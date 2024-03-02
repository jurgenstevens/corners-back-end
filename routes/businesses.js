import { Router } from "express"
import { checkAuth, decodeUserFromToken } from '../middleware/auth.js'
import * as businessCtrl from '../controllers/businesses.js'

const router = Router()
// this was what was missing vvv
router.use(decodeUserFromToken)
router.get("/", businessCtrl.index)
router.get("/:id", businessCtrl.show)
router.post("/register", checkAuth, businessCtrl.create)
router.put("/edit/:id", checkAuth, businessCtrl.edit)
router.delete("/:id", checkAuth, businessCtrl.delete)
router.put("/add-product/:id", checkAuth, businessCtrl.addProduct)
router.put("/delete-all/:id", checkAuth, businessCtrl.clearProducts)
router.put("/edit-stock/:id", checkAuth, businessCtrl.editStock)


export { router }