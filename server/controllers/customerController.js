const Customer = require('../models/customer')
const mongoose = require('mongoose');

exports.homepage = async (req, res) => {
  const messages = await req.flash("info");

  const locals = {
    title: "NodeJs",
    description: "Free NodeJs User Management System",
  };

  let perPage = 12;
  let page = req.query.page || 1;

  try {
    const customers = await Customer.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    // Count is deprecated. Use countDocuments({}) or estimatedDocumentCount()
    // const count = await Customer.count();
    const count = await Customer.countDocuments({});

    res.render("index", {
      locals,
      customers,
      current: page,
      pages: Math.ceil(count / perPage),
      messages,
    });
  } catch (error) {
    console.log(error);
  }
};

// renders add customer page
exports.addCustomer = async (req, res) => {

  const locals = {
    title: "add new custmer",
    description: "Free NodeJs User Management System",
  }
  res.render('customer/add',locals);
};

//creates new customer
exports.postCustomer = async (req, res) => {
  const newCustomer = new Customer({
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    details:req.body.details,
    email:req.body.email,
    tel:req.body.tel,
  });

  try {

    await Customer.create(newCustomer);
    await req.flash('info','new customer added');
    res.redirect('/');

  } catch (error) {
    console.log(error)
  }
  
};

exports.view = async (req, res) => {

  try {

    const customer = await Customer.findOne({_id:req.params.id});
    
    res.render('customer/view',{customer});

  } catch (error) {
    console.log(error)
  }
  
};

exports.edit = async (req, res) => {

  try {

    const customer = await Customer.findOne({_id:req.params.id});
    
    res.render('customer/edit',{customer});

  } catch (error) {
    console.log(error)
  }
  
};

exports.editPost = async (req, res) => {

  try {
    
    await Customer.findByIdAndUpdate(req.params.id,{
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        tel:req.body.tel,
    
    });
    res.redirect(`/edit/${req.params.id}`);

  } catch (error) {
    console.log(error);
  }
  
};

exports.deleteCustomer = async (req, res) => {

  try {
    
    await Customer.deleteOne({_id:req.params.id});
    res.redirect(`/`);

  } catch (error) {
    console.log(error);
  }
  
};

exports.searchCustomer = async (req, res) => {
  
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
    const customers = await Customer.find({
      $or:[
        {firstName:{$regex : new RegExp(searchNoSpecialChar,'i')}},
        {lastName:{$regex : new RegExp(searchNoSpecialChar,'i')}},
      ]
    });
    res.render(`search`,{
      customers,
    });

  } catch (error) {
    console.log(error);
  }

};

