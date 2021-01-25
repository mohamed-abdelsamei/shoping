const Product =require('../models/product');

module.exports.list = async (req, res, next)=>{
  try {
    const {page=0, limit=10}=req.query;
    const products = await Product.find().limit(limit).skip(page*limit);
    res.json(products);
  } catch (err) {
    next(err);
  }
};


module.exports.create = async (req, res, next)=>{
  try {
    console.log(req.body);
    if (!req.body.name|| !req.body.price||!req.body.category) {
      throw new Error('name,price, category are required');
    }
    const product =new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
};

module.exports.update = async (req, res, next)=>{
  try {
    const id = req.params.id;
    const product =await Product.findById(id);
    if (!product) throw new Error('Product not found');
    Object.assign(product, req.body);
    await product.save();
    res.json({product, msg: 'product updated'});
  } catch (err) {
    next(err);
  }
};


module.exports.delete = async (req, res, next)=>{
  try {
    const id = req.params.id;
    const product =await Product.findById(id);
    if (!product) throw new Error('Product not found');
    await product.remove();

    res.json({'msg': 'product removed'});
  } catch (err) {
    next(err);
  }
};

module.exports.findById = async (req, res, next)=>{
  try {
    const id = req.params.id;
    const product =await Product.findById(id);
    if (!product) throw new Error('Product not found');
    res.json({product});
  } catch (err) {
    next(err);
  }
};
