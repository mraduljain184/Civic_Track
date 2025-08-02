const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: {
    unique: true,
    type: String,   
    required: true, 
  },
  phone: {
    unique: true,
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,   
    required: true, 
  },    
})
const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;