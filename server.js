
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const bodyParser =require("body-parser")
const indexRouter = require('./routes/index')
const authRouter = require('./routes/logandsign')
const homeRouter = require('./routes/home')

app.set('view engine','ejs')
app.set('views',__dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))

const mongoose = require('mongoose');
const newuser = require('./models/newuser')
mongoose.connect(process.env.DATABASE_URL ,{useNewUrlParser: true})


const db = mongoose.connection
db.on('error',error => console.error(error))
db.once('open',()=> console.log('Connected to Mongoose'))
app.use('/',indexRouter)
app.use('/',authRouter)
app.use('/',homeRouter)

const currUser={
    "name":"login",
    "email":"login"
}

app.post('/register',(req,res)=>{
    var name= req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    var data ={
        "name":name,
        "email":email,
        "password":password
    }

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            console.log("error");
        }
        console.log("Record Inserted");
    });

    return res.redirect('/login');
})
app.post('/login',async (req,res)=>{

    var data ={
        email :req.body.email,
        password:req.body.password
    }

    try {
        const userfind = await db.collection('users').find({}).toArray();
        user = userfind.find(x => x.email === data.email);
        if (user === null || user.password !== data.password) {
            console.log("Invalid email or password");
        } else {
            res.locals.currUser = user;
            console.log("Login successful");
        }
    } catch (err) {
        console.log("fuck");
    }

    return res.redirect('/home');

})

app.listen(process.env.PORT ||3000)