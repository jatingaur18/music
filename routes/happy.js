const express = require('express')
const router = express.Router()
router.get('/happy',(req,res)=>{
    res.render('happy',{user: user})
})

module.exports = router