const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// requiring User model
const User = require('../../models/user');


router.get('/',(req,res,next)=>{

      User.find().then(result=>{
                res.status(200).json({
                    no_of_users : result.length,
                    Users: result
                });

      }).catch(err=>{

            res.staus(500).json({
                  error : err
            });
      });
});

router.post('/signup',(req,res,next)=>{

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

});


router.delete('/:userId',(req,res,next)=>{

        User.deleteOne({_id:req.params.userId}).exec().then(result=>{

            res.status(200).json({
                message : "user deleted"
            })

        }).catch(err=>{
          res.staus(500).json({
                error : err
          });
        });
});
module.exports = router;
