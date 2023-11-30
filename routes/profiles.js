import { Router } from 'express'
// !Create checkAdmin middleware in auth.js and import it here
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'
import * as profilesCtrl from '../controllers/profiles.js'

const router = Router()

/*---------- Public Routes ----------*/


/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)

// Admin Routes
router.get('/', checkAuth, profilesCtrl.index)
router.post('/admin/approve-store-owner/:id', checkAuth, profilesCtrl.approveStore)

router.put('/:id/add-photo', checkAuth, profilesCtrl.addPhoto)

export { router }
