const express = require('express')
const router = express.Router()
const { MongoClient, ObjectId } = require('mongodb');



const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL ,{useNewUrlParser: true});

const db = mongoose.connection
db.on('error',error => console.error(error))

router.get('/happy', async (req, res) => {
    try {
      const Songs = await db.collection('songs').find({}).toArray();
      console.log(Songs);
      const happySongs = Songs.filter(x => { return x.user === user.name && x.emotion === 'happy';});
      res.render('happy', { happySongs , user});
    } catch (error) {
      console.error('Error retrieving happy songs:', error);
      res.status(500).send('Internal Server Error');
    }
  });


module.exports = router