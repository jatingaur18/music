const express = require('express')
const router = express.Router()
router.get('/home',(req,res)=>{
    res.render('home',{user: user})
})

module.exports = router