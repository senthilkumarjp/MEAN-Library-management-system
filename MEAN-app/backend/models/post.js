const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  FullName:{type:String, required:true},
  RegisterNo :{type:String, required:true},
  Department:{type:String, required:true},
  Year:{type:String, required:true},
  EnteringTime:{type:String, required:true}
})

module.exports = mongoose.model('Post',postSchema);
