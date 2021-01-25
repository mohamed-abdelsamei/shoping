const Order =require('../models/order');
const Product =require('../models/product');

module.exports.list = async (req, res, next)=>{
  try {
    const {page=1, limit=10}=req.query;
    const orders = await Order.find().limit(limit).skip(page*limit);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};


module.exports.create = async (req, res, next)=>{
  try {
    const {products} =req.body;
    const user =req.user;
    const ids = products.map((p)=>p.id);
    let items = await Product.find({'_id': {$in: ids}}).lean();

    const available = items.every((item)=>{
      const product = products.find((p)=>p.id===item._id.toString());
      return product.quantity<=item.quantity;
    });
    if (!available) throw new Error('invalid quantity');

    items = items.map((item)=>{
      return {
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: products.find((p)=>p.id===item._id.toString()).quantity,
      };
    });

    const actualPrice = items.reduce((a, b)=>{
      const product = products.find((p)=>p.id===b.id.toString());
      return a+(b.price*product.quantity);
    }, 0);

    const priceWithoutGrocery = items.reduce((a, b)=>{
      if (b.category==='grocery') return a;
      const product = products.find((p)=>p.id===b.id.toString());
      return a+(b.price*product.quantity);
    }, 0);

    let finalPrice = actualPrice;
    let discount=0;
    const twoYearFromNow = new Date();
    twoYearFromNow.setFullYear(twoYearFromNow.getFullYear() -2);
    const discountDetails = {};
    // 5. The percentage based discounts do not apply on groceries.
    if (user.isEmployee) {
      // 1. If the user is an employee of the store, he gets a 30% discount.
      const value =priceWithoutGrocery*30/100;
      discount =discount+ value;
      discountDetails.isEmployee = value;
    } else if (user.isAffiliate) {
      // 2. If the user is an affiliate of the store, he gets a 10% discount.
      const value =priceWithoutGrocery*10/100;
      discount =discount+ value;
      discountDetails.isAffiliate = value;
    } else if (new Date(user.createdAt) <=twoYearFromNow) {
      // 3. If the user has been a customer for over 2 years,he gets 5% discount
      const value =priceWithoutGrocery*5/100;
      discount =discount+ value;
      discountDetails.twoYearsMember = value;
    }

    if (actualPrice>100) {
      // 4. For every $100 on the bill, there would be a $ 5 discount
      const value =Math.floor(actualPrice/100)*5;
      discount =discount+ value;
      discountDetails.fivePer100 = value;
    }

    finalPrice = actualPrice-discount;

    // TODO  decrease quantity
    const order = new Order({
      items,
      actualPrice,
      finalPrice,
      discount,
      discountDetails,
    });
    await order.save();
    res.json({order});
  } catch (err) {
    next(err);
  }
};

module.exports.update = async (req, res, next)=>{
  try {
    const id = req.params.id;
    const order =await Order.findById(id);
    if (!order) throw new Error('Order not found');
    Object.assign(order, req.body);
    await order.save();
    res.json({order, msg: 'order updated'});
  } catch (err) {
    next(err);
  }
};


module.exports.delete = async (req, res, next)=>{
  try {
    const id = req.params.id;
    const order =await Order.findById(id);
    if (!order) throw new Error('Order not found');
    await order.remove();

    res.json({'msg': 'order removed'});
  } catch (err) {
    next(err);
  }
};

module.exports.findById = async (req, res, next)=>{
  try {
    const id = req.params.id;
    const order =await Order.findById(id);
    if (!order) throw new Error('Order not found');
    res.json({order});
  } catch (err) {
    next(err);
  }
};
