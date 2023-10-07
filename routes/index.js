const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.render('index')
    res.set({"Allow-access-Allow-Origin":'*'})
})
 
module.exports = router