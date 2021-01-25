const mongoose =require('mongoose');
const {Schema} = mongoose;

const productSchema = new Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  category: {type: String, required: true},
  quantity: {type: Number, default: 1},
  price: {type: Number},
}, {timestamps: true});

const Product = mongoose.model('Product', productSchema);
module.exports=Product;
