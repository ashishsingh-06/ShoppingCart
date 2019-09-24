const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../../models/order');
const Product = require('../../models/product');
const checkAuth = require('../middleware/check-auth');

exports.get_all_orders = (req,res,next)=>
{

      Order.find().select('_id product quantity').populate('product','name').then(result=>{

          res.status(200).json({
              message : "orders fetched",
              Orders: result,
              total_orders: result.length
          });

      }).catch(err=>{
          console.log(err);
      });
}


exports.create_order = (req,res,next)=>
{
    Product.findById(req.body.productId).then(result=>{

      if(!result)
      {
        return res.status(404).json({
              message : "product not found"
        })
      }

      const order = new Order({
        _id : mongoose.Types.ObjectId(),
        quantity:req.body.quantity,
        product:req.body.productId
      });

      return order.save();

    }).then(result => {

        res.status(201).json({
            message: "order placed",
            data : result
        });

    }).catch(err=>{
          res.status(500).json({
            message : 'Product not found',
            error:err
          })
    });
}

exports.get_single_order = (req,res,next)=>{

      Order.findById(req.params.orderId).populate('product').exec().then(result=>{

        if(!result)
        {
          res.status(400).json({
              message : "No products found associated with this ID"
          });
        }

        res.status(200).json({
          order: result,
          request : {
            type:"GET",
            description: "GET_ALL_ORDERS",
            url:"localhost:3000/orders"
          }
        });

      }).catch(err=>{
          res.status(500).json({
              error : err
          });
      });
}


exports.update_order = (req,res,next)=>
{
      res.status(201).json({
          message : "orders details",
          orderId : req.params.orderId
      });
}

exports.delete_order = (req,res,next)=>
{
      Order.remove( {_id:req.params.orderId}).exec().then(result=>{
          res.status(200).json({
              message : "order deleted",
              request: {
                type: "POST",
                description : "Place new order",
                url : "localhost:3000/orders",
                body:{ "productId":'ID' , "quantity" : 'Number'}
              }
          });
      }).catch(err=>{
          res.status(500).json({
            err: err
          })
      })
}
