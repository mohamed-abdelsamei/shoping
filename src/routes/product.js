const express = require('express');
const router =new express.Router();
const controller = require('../controllers/product');
router.get('/', controller.list);
router.post('/', controller.create);
router.get('/:id', controller.findById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
