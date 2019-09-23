const jwt = require('jsonwebtoken');
module.exports = (req, res, next) =>{

  try
  {
      const token = req.headers.authorization.split(" ")[1];
      console.log(token);
      jwt.verify(token,"thiskeyisencrypted",null,(err,result)=>{

      if(err)
      {
        return res.status(401).json({
            message : "Auth failed"
        });
      }
      else
      {

        req.userData = result;
        next();
      }

    });
  }catch(error){

      return res.status(401).json({
          message : "Auth failed"
      });
  }

};
