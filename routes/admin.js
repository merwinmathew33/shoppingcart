var express = require('express');
const { Db } = require('mongodb');
const app = require('../app');
var router = express.Router();
const productHelper = require('../helper/product-helper')


/* GET users listing. */
router.get('/', function(req, res, next) {

  productHelper.getAllProducts().then((product)=>{
    console.log(product)
    res.render('admin/view-products',{product, admin:true});
  })

});

router.get('/add-products',function (req,res){
  res.render('admin/add-products')
})

router.post('/add-products',(req,res)=>{
 productHelper.addProduct(req.body,(id)=>{
   let image = req.files.Image;
   image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
    if(!err){
      res.render("admin/add-products")
      console.log(id)
    }else{
      console.log(err);
    }
   })
 })
  })
router.get('/edit-products/:id', async (req,res)=>{
   product = await productHelper.getProductDetails(req.params.id)
   console.log(product)
  res.render('admin/edit-products',{product})
})
router.post('/edit-products/:id',(req,res)=>{
  productHelper.updateProducts(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    let image = req.files.Image
    var id = req.params.id
    image.mv('./public/product-images/'+id+'.jpg')
  })
})

router.get('/delete-products/:id',(req,res)=>{
  let proId = req.params.id
  productHelper.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })
})

module.exports = router;

