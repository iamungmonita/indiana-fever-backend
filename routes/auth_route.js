const { Router } = require('express')
const auth = require('../controllers/auth_control')
const router = Router()

//admin
router.post('/auth/register', auth.register)
router.post('/auth/sign-in', auth.login)
router.get('/auth/sign-out', auth.logout)
router.get('/auth/check_cookie', auth.cookie)

//membership


module.exports = router;