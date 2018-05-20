const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Order = require("../models/order");
const Product = require("../models/product");

// order get req
router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc.id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:5000/orders/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

//order post req
router.post("/", async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId);
    const result = product => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
      });
       await order.save();
    };
    console.log(result);
    res.status(200).json({
      message: "order stored",
      createdOrder: {
        _id: result._id,
        product: result.product,
        quantity: result.quantity
      },
      request: {
        type: "GET",
        url: "http://localhost:3000/orders/" + result._id
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

// individual order req
router.get("/:orderID", (req, res, next) => {
  res.status(200).json({
    message: "order details ",
    orderId: req.params.orderID
  });
});
router.delete("/:orderID", (req, res, next) => {
  res.status(200).json({ message: "order deleted" });
});

module.exports = router;
