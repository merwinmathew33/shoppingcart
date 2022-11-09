
var express = require('express');
var router = express.Router();
const productHelper = require('../helper/product-helper')
const userHelper = require('../helper/user-helper')

/* GET home page. */
router.get('/', function(req, res, next) {

  let user = req.session.user

  productHelper.getAllProducts().then((product)=>{
    res.render('index',{product,user});
  })


});
router.get('/login',function(req,res){
  if(req.session.loggedIn){
    res.redirect('/')
  }
  else{
    res.render('user/login')
  }
})

router.get('/signup',(req,res)=>{
  
  res.render('user/signup')
})

router.post('/signup',(req,res)=>{
  userHelper.doSignup(req.body).then((response)=>{
    res.render('user/login')
  })
})
router.post('/login',(req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    }else{
      res.redirect('/login')
    }
  })
  
})

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

const verifyLogin = (req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

router.get('/cart',(req,res,next)=>{
  res.render('user/cart')
})
router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
  userHelper.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.redirect('/')
  })
})

module.exports = router;
