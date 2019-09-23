const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const multer = require('multer');
const path = require('path');
const checkAuth = require('../middleware/check-auth');

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

router.get('/',(req,res,next)=>
{
    Product.find().select('name price _id productImage').exec().then(docs=>{

      if(docs.length>0)
      {
        const result = {
          products : docs.map(docs=>{
            return {
              name : docs.name,
              price: docs.price,
              id : docs._id,
              productImage: docs.productImage,
              request:{
                type: 'GET',
                description : 'GET_DETAILS_OF_THE_PRODUCT',
                url : 'localhost:3000/products/' + docs._id
              }
            }
          })
        }
        res.status(200).json({
          message: 'products fetched',
          data : result,
          total_products : docs.length
        });
    }

    else {
      res.status(200).json({
          message : "No products found"
      });
    }

    }).catch(err=>{
        res.status(500).json({
          error : err
        });
    });

});

router.post('/',checkAuth,upload.single('productImage'),(req,res,next)=>
{

    console.log(req.file);
    let data = {};
    const product = new Product({
    //    _id : new mongoose.Type.ObjectId(),
        name : req.body.name,
        price : req.body.price,
        productImage : req.file.path
    });

    product.save().then(result => {
      res.status(201).json({
        message : "product created Successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          id: result._id,
          request:{
            type:"GET",
            description : 'GET_DETAILS_OF_THE_PRODUCT',
            url: 'localhost:3000/products/'+result._id
          }
        }
      });

    }).catch(err => {

       console.log(err);
    });


});

router.get('/:productId',(req,res,next)=>
{
      const id = req.params.productId;
      Product.findById(id).select('name price _id').exec().then(data=>{

        if(data){
          res.json({

            status: 200,
            data: data,
            request : {
              type: "GET",
              description :'GET_ALL_PRODUCTS',
              url: 'localhost:3000/products'
            }

          });

        }else {
          res.status(404).json({
            message : "No product found associated with this id"
          })
        }

      }).catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
      });

});

router.patch('/:productId',checkAuth,(req,res,next)=>
{
      const id = req.params.productId;
      const updateOperations = {};
      for(const ops of req.body)
      {
        updateOperations[ops.propName] = ops.value;
      }

      Product.update({ _id:id }, { $set: updateOperations }).exec().then(result=>{

                res.status(200).json({
                  message:"product updated",
                  request:{
                    type:"GET",
                    description : "GET_PRODUCT_DETAILS",
                    url: "localhost:3000/products/" + id
                  }
                });

      }).catch(err=>{

          res.status(500).json({
              error : err
          });

      });
});

router.delete('/:productId',checkAuth,(req,res,next)=>
{
    const id = req.params.productId;
    Product.findByIdAndDelete(id).then(data=>{

      if(data==null)
      {
        res.status(404).json({
            message:'Product not found, It may have been already deleted'
        });
      }
      res.status(200).json({
        message : "Product deleted",
        request: {
          type: 'POST',
          description: 'ADD_ANOTHER_PRODCUT',
          url: 'localhost:3000//products'
        }
      });
    }).catch(err=>{
        console.log(err);
    });

});

module.exports = router;
