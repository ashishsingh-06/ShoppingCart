const express = require('express');
const router = express.Router();

router.get('/', (req,res,next)=>
{
    res.status(200).json({
      message : "handling GET request"
    });
});


router.post('/', (req,res,next)=>
{
    res.status(201).json({
      message : "handling POST request"
    });
});

router.get('/:productId',(req,res,next)=>
{
      const id = req.params.productId;
      res.status(200).json({
        productId : id
      });
});

router.patch('/:productId',(req,res,next)=>
{
      res.status(200).json({
        message : "updated product"
      });
});

router.delete('/:productId',(req,res,next)=>
{
      res.status(200).json({
        message : "deleted product"
      });
});

module.exports = router;
