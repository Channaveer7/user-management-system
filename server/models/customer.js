const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CustomerSchema = new Schema({

    firstName:{
        type: String,
        required : true
    },
    lastName:{
        type: String,
        required : true
    },
    tel:{
        type: String,
        required : true
    },
    email:{
        type: String,
        required : true
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    updateAt:{
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Customer',CustomerSchema);