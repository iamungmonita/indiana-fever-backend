const { Router } = require('express')
const message = require('../controllers/message_control')
const router = Router()

router.post('/message/send', message.send_message)
router.get('/message/receive', message.receive_message)

module.exports = router;