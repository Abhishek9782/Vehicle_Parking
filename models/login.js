const mongoose=require('mongoose')
 const mongo=mongoose.Schema({
    username:String,
    password:String
 })
module.exports= mongoose.model('parking',mongo) 