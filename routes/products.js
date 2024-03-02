import { Router } from "express"
import { decodeUserFromToken, checkAuth } from "../middleware/auth.js"
import * as productsCtrl from "../controllers/product.js"

const router = Router()

router.use(decodeUserFromToken)
  // no auth yet until we figure out what twe will do with products and admins'


router.get("/", productsCtrl.index)
router.post("/create-new", productsCtrl.create)
router.delete("/delete/:id", productsCtrl.delete)


export { router }