const mongoose=require('mongoose')
const park=mongoose.Schema({
    vno:String,
    time:String,
    vtype:String,
    status:String,
    vin:String,
    vout:String,
    price:Number,
    total:Number,
    sr:String,
  


})
module.exports=  mongoose.model('intime',park)
