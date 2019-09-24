const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');


exports.get_users = (req,res,next)=>{


      User.find().then(result=>{

                res.status(200).json({
                    no_of_users : result.length,
                    test_User: result[0].email
                });


      }).catch(err=>{

            res.status(500).json({
                  error : err
            });
      });
}

exports.user_signup = (req,res,next)=>{

  User.find({email:req.body.email}).exec().then(result=>{

      if(result.length>=1)
      {
        res.status(409).json({
            message : "email exists, please provide another email Id"
        });
      }
      else {

        bcrypt.hash(req.body.password,10,(err,hash)=>{
            if(err)
            {
              return res.status(500).json({
                  error : err
              });
            }
            else {

              const user = new User({
                  email: req.body.email,
                  password: hash
              });
              user.save().then(result=>{
                  console.log('user created' + result);
                  res.status(201).json({
                      message : "User Created"
                  });
              }).catch(err=>{
                  res.status(201).json({
                    error : err
                  });
              });
            }
        });

      }

  }).catch(err=>{

      res.status(500).json({
            error: err
      });
  });

}

exports.user_login = (req,res,next)=>{


        User.find({email:req.body.email})
        .then(user=>{

            if(user.length<1)
            {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(req.body.password,user[0].password,(err,result)=>{

              if(err){
                return res.status(401).json({
                    message: "Auth failed "
                });
              }
              if(result){

                const token = jwt.sign({
                  email: user[0].email,
                  userId: user[0]._id
                },
                "thiskeyisencrypted",
                {
                  expiresIn : "1h"
                });
                return res.status(200).json({
                    message: "Auth successfull",
                    token: token
                });
              }
              return res.status(401).json({
                  message: "Auth failed"
              });

            });

        }).catch(err=>{
            res.status(500).json({
                error : err
            });
        });
}

exports.delete_user = (req,res,next)=>{

        User.deleteOne({_id:req.params.userId}).exec().then(result=>{

            res.status(200).json({
                message : "user deleted"
            })

        }).catch(err=>{
          res.status(500).json({
                error : err
          });
        });
}
