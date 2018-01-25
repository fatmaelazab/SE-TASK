var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');



//User Schema
var userSchema = mongoose.Schema({

  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  username: {
    type: String
  },
  password: {
    type: String
  },

  facebook:{
    id:{ 
      type: String 
    },
    id : {type: String},
    token: { type: String },
    facebookEmail:{ type: String } ,
    name: { type: String }
  }

});

var User = module.exports = mongoose.model('users',userSchema);

module.exports.createUser= function(newUser,callback){
  bcrypt.genSalt(10, function(err, salt) {
   bcrypt.hash(newUser.password, salt, function(err, hash) {
       newUser.password=hash;
       newUser.save(callback);
   });
});
}

module.exports.getUserByUsername = function(username,callback){
  var query = {username:username};
  User.findOne(query,callback);

}

module.exports.comparePassword = function(candidatePassword,hash,callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      if(err) throw err;
      callback(null,isMatch);
});
}

module.exports.getUserById = function(id,callback){
	User.findById(id, callback);
}
