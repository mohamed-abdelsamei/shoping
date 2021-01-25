const express = require('express');
const router =new express.Router();
const controller = require('../controllers/order');
const authenticateJWT = require('../middlewares/authenticateJWT');

router.get('/', authenticateJWT, controller.list);
router.post('/', authenticateJWT, controller.create);
router.get('/:id', authenticateJWT, controller.findById);
router.put('/:id', authenticateJWT, controller.update);
router.delete('/:id', authenticateJWT, controller.delete);

module.exports = router;
