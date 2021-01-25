const UserRouter = require('./user');
const ProductRouter = require('./product');
const OrderRouter = require('./order');
const express = require('express');
const router =new express.Router();


router.use('/user', UserRouter);
router.use('/products', ProductRouter);
router.use('/orders', OrderRouter);


module.exports=router;
