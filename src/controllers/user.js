const User =require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config');
module.exports.list = async (req, res, next)=>{
  try {
    const {page=0, limit=10}=req.query;
    const users = await User.find().limit(limit).skip(page*limit);
    return res.json(users);
  } catch (err) {
    next(err);
  }
};


module.exports.create = async (req, res, next)=>{
  try {
    console.log(req.body);
    if (!req.body.email || !req.body.password) {
      throw new Error('Please enter email and password');
    }
    const exists =await User.findOne({email: req.body.email});
    if (exists) throw new Error('this email belong to another account');
    const user =new User(req.body);
    await user.save();
    return res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports.update = async (req, res, next)=>{
  try {
    const id = req.params.id;
    const user =await User.findById(id);
    if (!user) throw new Error('User not found');
    Object.assign(user, req.body);
    await user.save();
    return res.json({user, msg: 'user updated'});
  } catch (err) {
    next(err);
  }
};


module.exports.delete = async (req, res, next)=>{
  try {
    const id = req.params.id;
    const user =await User.findById(id);
    if (!user) throw new Error('User not found');
    await user.remove();

    return res.json({'msg': 'user removed'});
  } catch (err) {
    next(err);
  }
};

module.exports.findById = async (req, res, next)=>{
  try {
    const id = req.params.id;
    const user =await User.findById(id);
    if (!user) throw new Error('User not found');
    return res.json({user});
  } catch (err) {
    next(err);
  }
};


module.exports.login = async (req, res, next)=>{
  try {
    const {email, password}=req.body;
    const user =await User.findOne({email: email});
    if (!user) throw new Error('Username or password incorrect');
    const valid =await user.validatePassword(password+'');
    if (!valid) throw new Error('Username or password incorrect');

    // Generate an access token
    const token = jwt.sign({id: user._id}, config.accessTokenSecret);

    return res.json({token});
  } catch (err) {
    next(err);
  }
};


module.exports.me = async (req, res, next)=>{
  try {
    // const id = req.user.id;
    // const user =await User.findById(id);
    // if (!user) throw new Error('User not found');
    res.json({user: req.user});
  } catch (err) {
    next(err);
  }
};
