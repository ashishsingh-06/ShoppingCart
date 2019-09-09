const express = require('express');

const app = express();

const morgan = require('morgan');

app.use(morgan('dev'));

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use('/prodcuts',productRoutes);
app.use('/orders',orderRoutes);

app.use((req,res,next)=>
{
  const error = new Error('Error page not found');
  error.status = 404;
  next(error);
});

app.use((error,req,res,next)=>
{
      res.status(error.status || 5000);
      res.json({
        error : {
            "message" : error.message;
        }
      })
});

module.exports = app;
