const express = require('express')
const router = express.Router()
const currUser={
    "name":"login",
    "email":"login"
}
router.get('/',(req,res)=>{
    res.render('index',{user:currUser})
})
 
module.exports = router