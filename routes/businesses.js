import { Router } from "express"
import { checkAuth, decodeUserFromToken } from '../middleware/auth.js'
import * as businessCtrl from '../controllers/businesses.js'
import { decodeUserFromToken, checkAuth, checkAdmin, checkStoreOwner, checkAdminOrStoreOwner } from "../middleware/middleware.js"

const router = Router();

router.use(decodeUserFromToken)
// GET localhost:3000/businesses/ (Fetch businesses for the current user - Store Owners & Admins)
router.get('/', checkAuth, checkAdminOrStoreOwner, businessCtrl.index)

// GET localhost:3000/businesses/:businessId (Show specific business details - Store Owners & Admins)
router.get('/:businessId', checkAuth, checkAdminOrStoreOwner, businessCtrl.show)

// POST localhost:3000/businesses (Only Admin can create new businesses)
router.post('/', checkAuth, checkAdmin, businessCtrl.create)

// GET localhost:3000/businesses/:businessId/edit (Store Owners can edit their business or Admin can edit)
router.get('/:businessId/edit', checkAuth, checkAdminOrStoreOwner, businessCtrl.edit)

// PATCH localhost:3000/businesses/:businessId/approve-business (Only Admin can approve a business)
router.patch('/:businessId/approve-business', checkAuth, checkAdmin, businessCtrl.approveBusiness)

// PATCH localhost:3000/businesses/:businessId/deny-business (Only Admin can deny a business)
router.patch('/:businessId/deny-business', checkAuth, checkAdmin, businessCtrl.denyBusiness)

// PUT localhost:3000/businesses/:businessId/update (Only Admin can update business account details)
router.put('/:businessId/update', checkAuth, checkAdmin, businessCtrl.updateBusinessAccount)

// PUT localhost:3000/businesses/:businessId/update-business-profile (Store Owners can update their business profile)
router.put('/:businessId/update-business-profile', checkAuth, checkStoreOwner, businessCtrl.updateBusinessProfile)

// DELETE localhost:3000/businesses/:businessId (Only Admin can delete a business)
router.delete('/:businessId', checkAuth, checkAdmin, businessCtrl.delete)

// SOME OF THESE ROUTES BELONG IN THE PRODUCTS ROUTES FILE
// router.get("/", businessCtrl.index)
// router.get("/:id", businessCtrl.show)
// router.post("/register", checkAuth, businessCtrl.create)
// router.put("/edit/:id", checkAuth, businessCtrl.edit)
// router.delete("/:id", checkAuth, businessCtrl.delete)
// router.put("/add-product/:id", checkAuth, businessCtrl.addProduct)
// router.put("/delete-all/:id", checkAuth, businessCtrl.clearProducts)
// router.put("/edit-stock/:id", checkAuth, businessCtrl.editStock)

export { router }