var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');



//User Schema
var fbSchema = mongoose.Schema({

    id:{
         type: String },
    token: 
    { type: String },
    email:
    { type: String } ,
    name: 
    { type: String }
  

});

var Userfb = module.exports = mongoose.model('fbUsers',fbSchema);