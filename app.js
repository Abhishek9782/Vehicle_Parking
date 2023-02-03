const express=require('express')
const app= express();
port=5000

app.set('view engine','ejs')
const Session=require('express-session')


app.use(Session({
    secret:'abhi',
    resave:false,
    saveUninitialized:false,
    Cookie:{secure:false,maxAge:365 * 24 * 60 * 60 * 1000}
    
}))
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}));



const Front=require('./router/front')
app.use(Front)
const mongoose=require('mongoose');
const { Cookie } = require('express-session');
mongoose.connect('mongodb://127.0.0.1:27017/Parking',()=>{
    console.log('Server is connected With Mongoose')

})






app.all('*',(req,res)=>{
    res.send(`${req.originalUrl} is not found`)
})

app.listen(port,()=>{
console.log('server is connected with port')
})