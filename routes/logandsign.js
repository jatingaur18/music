const express = require('express')
const router = express.Router()
const currUser={
    "name":"login",
    "email":"login"
}
router.get('/login',(req,res)=>{
    res.render('login',{user: currUser})
})

router.get('/register',(req,res)=>{
    res.render('register',{user: currUser})
})

module.exports = router