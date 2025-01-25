const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');

//Create an order
router.post('/', async(req, res) => {
    const {customerName,items} = req.body;
    const totalPrice = items.reduce((total, item) => total + item.quantity * item.price, 0);
 

// Create the new order in the database
const newOrder = await Order.create({
        customerName,items,totalPrice
    })

const responseOrder = {
    orderId: newOrder._id,
    customerName: newOrder.customerName,
    items: newOrder.items,
    totalPrice: newOrder.totalPrice,
    orderDate: newOrder.orderDate
}

    res.status(201).json({ 
        message: 'Order created successfully!', 
        order: responseOrder });
})

router.get('/', async(req,res)=>{
    const orders=await Order.find();
    res.json({
        "message":"Successfull",
        order:orders
    });
});

router.get('/:orderId',async(req,res)=>{
    const id= req.params.orderId
    const orders=await Order.findById(id)
    res.json({
        "message":"Fetched single by id",
        order:orders
    })
})

router.patch('/update/:orderId', async(req, res) => {
    const id = req.params.orderId;
    const {customerName,items}=req.body;
    const totalPrice = items.reduce((total, item) => total + item.quantity * item.price, 0);
    const orders=await Order.findByIdAndUpdate(id,{
        customerName,items,totalPrice},
        {new:true

    })
    res.json({
         message: 'Order updated successfully!', 
         order:orders 
        });
});

//Delete an order
router.delete('/delete/:orderId', async(req, res) => {
    const id = req.params.orderId;
    const orders=await Order.findByIdAndDelete(id);
    res.status(200).json({
        message: 'Order deleted successfully!',
        order: orders
    });
});


module.exports = router; 