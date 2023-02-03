const mongoose=require('mongoose')
const mongo=mongoose.Schema({
    name:String,
    email:String,
    rev:String,
    status:String
})
module.exports= mongoose.model('review',mongo)

