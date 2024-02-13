import { Router } from "express"
import { decodeUserFromToken, checkAuth } from "../middleware/auth.js"
import * as productsCtrl from "../controllers/product.js"

const router = Router()

router.use(decodeUserFromToken)

router.get("/", productsCtrl.index)
router.post("/create-new", productsCtrl.create)


export { router }