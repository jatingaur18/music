const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { google } = require('googleapis');
const { MongoClient, ObjectId } = require('mongodb');
const stream = require('stream');
const apikeys = require('./drive_api.json');
const upload = multer()

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];


const KEYFILEPATH = path.join(__dirname, "drive_api.json");

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
const happyRouter = require('./routes/happy')
const angryRouter = require('./routes/angry')
const disgustRouter = require('./routes/disgust')
const sadRouter = require('./routes/sad')
const playerRouter = require('./routes/player')

app.use(bodyParser.json());

app.set('view engine','ejs')
app.set('views',__dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))

const mongoose = require('mongoose');
const newuser = require('./models/newuser')
mongoose.connect(process.env.DATABASE_URL ,{useNewUrlParser: true});

const db = mongoose.connection
db.on('error',error => console.error(error))
//db.once('open',()=> console.log('Connected to Mongoose'))


db.once('open',()=>{
    console.log('Connected to Mongoose');
})

 

app.use('/',indexRouter)
app.use('/',authRouter)
app.use('/',homeRouter)
app.use('/',happyRouter)
app.use('/',playerRouter)
app.use('/',angryRouter)
app.use('/',disgustRouter)
app.use('/',sadRouter)
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

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
    currUser.name=user.name;
    return res.redirect('/home');

})

const song={
  "user":"--",
  "name":"--no-name--",
  "emotion":"--",
  "id":"--"
}

app.post("/upload", upload.any(), async (req, res) => {
  try {
      //console.log(req.body.name);
      song.name=req.body.name;
      song.emotion=req.body.emotion;
      console.log(req.body);
      console.log(req.files);
      const { body, files } = req;

      for (let f = 0; f < files.length; f += 1) {
          await uploadFile(files[f]);
      }

      res.status(200).send("Form Submitted");
  } catch (f) {
      res.send(f.message);
  }
});

const uploadFile = async (fileObject) => {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);
  const { data } = await google.drive({ version: "v3", auth }).files.create({
      media: {
          mimeType: fileObject.mimeType,
          body: bufferStream,
      },
      requestBody: {
          name: fileObject.originalname,
          parents: ["17tr91RoUBrN5gLJdzm8zygRoj043__Ep"],
      },
      fields: "id,name",
  });
  song.id=data.id;
  song.user=user.name;
  console.log(`Uploaded file ${data.name} ${data.id}`);
  console.log(song);

  db.collection('songs').insertOne(song,(err,collection)=>{
    if(err){
        console.log("error");
    }
    console.log("Record Inserted");
});

};

app.listen(process.env.PORT ||3001)