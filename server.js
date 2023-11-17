const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');


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

app.use(bodyParser.json());
app.use(methodOverride('_method'));

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

let gfs;

db.once('open',()=>{
    console.log('Connected to Mongoose'),
    gfs = Grid(db.db,mongoose.mongo);
    gfs.collection('songs');
})

 

app.use('/',indexRouter)
app.use('/',authRouter)
app.use('/',homeRouter)


let filen;

const storage = new GridFsStorage({
    
    url: 'mongodb+srv://MicroftHolmes:rvq6vjPrtPQSyGk7@cluster0.gq5rvso.mongodb.net/test',
    file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'songs'
        };
        resolve(fileInfo);
        filen=fileInfo.filename;
      });
    });
  }
});
const upload = multer({ storage });


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

app.post('/upload',upload.single('file'),(req,res)=>{
    res.json({file: req.file});
    console.log(filen);
});


app.get('/files', async (req, res) => {
    try {
        const files = await gfs.files.find().toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ err: 'No files exist' });
        }
        return res.json(files);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.get('/files/:filename', async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(file);
                }
            
        });

        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }

        // File exists
        return res.json(file);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            err: 'Internal Server Error'
        });
    }
});

app.get('/image/:filename', async (req, res) => {
    
        const file = await gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(file);
                }
            
        });

        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }

       // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
        
    
    
});



app.listen(process.env.PORT ||3001)