const express = require('express')
const router = express.Router()
const { MongoClient, ObjectId } = require('mongodb');



const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL ,{useNewUrlParser: true});

const db = mongoose.connection
db.on('error',error => console.error(error))

router.get('/angry', async (req, res) => {
    try {
      const Songs = await db.collection('songs').find({}).toArray();
      console.log(Songs);
      const angrySongs = Songs.filter(x => { return x.user === user.name && x.emotion === 'angry';});
      res.render('angry', { angrySongs , user});
    } catch (error) {
      console.error('Error retrieving angry songs:', error);
      res.status(500).send('Internal Server Error');
    }
  });


module.exports = router