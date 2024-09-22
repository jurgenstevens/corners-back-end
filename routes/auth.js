import { Router } from 'express'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'
import * as authCtrl from '../controllers/auth.js'

const router = Router()

/*---------- Public Routes ----------*/
router.post('/patron-signup', authCtrl.patronSignUp)
router.post('/store-owner-signup', authCtrl.storeOwnerSignUp)
router.post('/login', authCtrl.login)

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)
router.post('/change-password', checkAuth, authCtrl.changePassword)

export { router }
