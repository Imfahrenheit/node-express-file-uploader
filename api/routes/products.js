const express = require('express')
const router = express.Router()
const Product= require('../models/product')
const mongoose= require('mongoose')
mongoose.Promise = global.Promise;

// root get route
router.get('/', (req, res, next) => {

  Product.find()
  .select('name price _id')
  
    .exec()
    .then(docs => {
      const response= {
        count:docs.length,
        products:docs.map((doc)=>{
          return { 
            name:doc.name,
            price:doc.price,
            id:doc._id,
            request: {
               type: "GET", 
               url: "http://localhost:5000/products/" + doc._id
              } };


        })
      }
      res.status(200).json({ response });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });


})

// root post route
router.post('/', (req, res, next) => {
  
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  product
    .save()
    .then(result => {
      res
        .status(201)
        .json({
          message: " new product created ",
          createdProduct: { 
            name:result.name,
            price:result.price,
            id:result._id,
            request: {
               type: "GET", 
               url: "http://localhost:5000/products/" + result._id
              } }
        });
     
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });

  
});

// root params route
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId
  Product.findById(id)
    .select("name price _id")
    .exec()
    .then(doc => {
      if (doc) {
        res
          .status(200)
          .json({
            product: doc,
            request: {
              type: "GET",
              url: "http://localhost:5000/products/"
            }
          });
      } else {
        res.status(500).json({ message: "no product found for this id" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  
});

// product patch route
router.patch("/:productId", (req, res, next) => {
const id = req.params.productId;
const updateOps ={};
for(const ops of req.body){
  updateOps[ops.propName]=ops.value
}
Product.update({ _id: id },{$set:updateOps})
  .exec()
  .then(doc => {
    res.status(200).json({ doc });
  })
  .catch(err => {
    res.status(500).json({ error: err });
  });
  
});
// product delete route
router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(doc => {
      res.status(200).json({ doc });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  
});


module.exports= router;