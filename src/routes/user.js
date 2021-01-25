const express = require('express');
const router =new express.Router();
const controller = require('../controllers/user');
const authenticateJWT = require('../middlewares/authenticateJWT');

router.get('/', authenticateJWT, controller.list);
router.post('/', controller.create);
router.get('/:id', controller.findById);
router.put('/:id', authenticateJWT, controller.update);
router.delete('/:id', controller.delete);
router.get('/me', authenticateJWT, controller.me);
router.post('/login', controller.login);

module.exports = router;
