const mongoose =require('mongoose');
const {Schema} = mongoose;

const orderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  items: [{
    _id: false,
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    price: Number,
    name: String,
    quantity: Number,
  }],
  totalPrice: Number,
  actualPrice: Number,
  discount: Number,
  status: {type: String, enum: ['completed', 'canceled'], default: 'completed'},
  discountDetails: {},
}, {timestamps: true});

const Order = mongoose.model('Order', orderSchema);
module.exports=Order;
