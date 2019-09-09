const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>
{
      res.status(200).json({
          message : "orders fetched"
      });
});

router.post('/',(req,res,next)=>
{
      res.status(201).json({
          message : "orders was created"
      });
});

router.put('/:orderId',(req,res,next)=>
{
      res.status(201).json({
          message : "orders details",
          orderId : req.params.orderId
      });
});

router.delete('/:orderId',(req,res,next)=>
{
      res.status(201).json({
          message : "orders deleted",
          orderId : req.params.orderId
      });
});


module.exports = router;
