const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const multer = require('multer');
const path = require('path');
const checkAuth = require('../middleware/check-auth');
const productControllers = require('../controllers/products');

const storage = multer.diskStorage({

  destination : function(req,file,cb){

      cb(null,'./uploads/');
  },
  filename : function(req,file,cb){

      cb(null, file.originalname);
  }

 });

const fileFilter = (req,file,cb)=>{

      if(file.mimetype === 'image/jpeg' || file.mimetype==='image/png')
      {
        cb(null,true);
      }
      else {
        cb(null,false);
      }
 };

const upload = multer({storage: storage, limits:{fileSize: 1024*1024*5 },fileFilter:fileFilter});

router.get('/',productControllers.get_all_products);

router.post('/',checkAuth,upload.single('productImage'),productControllers.create_product);

router.get('/:productId',productControllers.get_single_product);

router.patch('/:productId',checkAuth,productControllers.update_product);

router.delete('/:productId',checkAuth,productControllers.delete_product);

module.exports = router;
