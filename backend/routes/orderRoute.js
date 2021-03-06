import express from 'express';
import Order from '../modals/orderModel';
import { isAuth, isAdmin } from '../util';

const router = express.Router();

// db.orders.find({"orderItems.owner":"geetendra"},{_id:0, orderItems:{$elemMatch:{owner:"geetendra"}}}).pretty()
//  db.orders.find({$and:[{"_id": ObjectId("5f2d5d1174b0932150874217")}, {"orderItems.owner":"geetendra"}]},  {_id:0, orderItems:{$elemMatch:{owner:"geetendra"}}}).pretty()
// Admin orders
router.get("/", isAuth, async (req, res) => {
  const userInfo = JSON.parse(req.cookies['userInfo'])
  const userName = userInfo.name
  const orders = await Order.find({"orderItems.owner" : userName}).populate('user');
  res.send(orders);
});

// Non-admin Orders
// router.get("/", isAuth, async (req, res) => {
//   const orders = await Order.find({}).populate('user');
//   res.send(orders);
// });


router.get("/mine", isAuth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
});

router.get("/:id", isAuth, async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id });
  if (order) {
    res.send(order);
  } else {
    res.status(404).send("Order Not Found.")
  }
});

// -----------Admin Detail Product
router.get("/Admin/:id", isAuth, async (req, res) => {
  const userInfo = JSON.parse(req.cookies['userInfo'])
  const userName = userInfo.name
  const order = await Order.findOne({$and:[{ _id: req.params.id }, {"orderItems.owner":userName}]},{_id:0, orderItems:{$elemMatch:{owner:userName}}});
  if (order) {
    res.send(order);
  } else {
    res.status(404).send("Order Not Found.")
  }
});

router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id });
  if (order) {
    const deletedOrder = await order.remove();
    res.send(deletedOrder);
  } else {
    res.status(404).send("Order Not Found.")
  }
});

router.post("/", isAuth, async (req, res) => {
  const newOrder = new Order({
    orderItems: req.body.orderItems,
    user: req.user._id,
    shipping: req.body.shipping,
    payment: req.body.payment,
    itemsPrice: req.body.itemsPrice,
    taxPrice: req.body.taxPrice,
    shippingPrice: req.body.shippingPrice,
    totalPrice: req.body.totalPrice,
  });
  // console.log(newOrder.orderItems);
  const newOrderCreated = await newOrder.save();
  res.status(201).send({ message: "New Order Created", data: newOrderCreated });
});

router.put("/:id/pay", isAuth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.payment = {
      paymentMethod: 'paypal',
      paymentResult: {
        payerID: req.body.payerID,
        orderID: req.body.orderID,
        paymentID: req.body.paymentID
      }
    }
    const updatedOrder = await order.save();
    res.send({ message: 'Order Paid.', order: updatedOrder });
  } else {
    res.status(404).send({ message: 'Order not found.' })
  }
});

export default router;