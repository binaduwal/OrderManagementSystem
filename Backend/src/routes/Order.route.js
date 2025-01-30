
const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const cors = require('cors');

const corsOptions = {
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200
};

router.use(cors(corsOptions));

// Create order
router.post('/orders', async(req, res) => {
    const {customerName,items} = req.body;
    const totalPrice = items.reduce((total, item) => total + item.quantity * item.price, 0);
    
    try {
        const newOrder = await Order.create({
            customerName,items,totalPrice
        });

        res.status(201).json({ 
            message: 'Order created successfully!', 
            order: newOrder 
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create order',
            error: error.message
        });
    }
});

// Get all orders
router.get('/orders', async(req,res) => {
    try {
        const orders = await Order.find();
        res.json({
            message: "Successfully fetched orders",
            order: orders
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
});

// Get single order
router.get('/orders/:id', async(req,res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }
        res.json({
            message: "Fetched single order",
            order: order
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch order',
            error: error.message
        });
    }
});

// Update order
router.patch('/orders/update/:id', async(req, res) => {
    try {
        const { customerName, items } = req.body;
        const totalPrice = items.reduce((total, item) => total + item.quantity * item.price, 0);
        
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { customerName, items, totalPrice },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        res.json({
            message: 'Order updated successfully!',
            order: order
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update order',
            error: error.message
        });
    }
});

// Delete order
router.delete('/orders/delete/:id', async(req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        res.status(200).json({
            message: 'Order deleted successfully!',
            order: order
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to delete order',
            error: error.message
        });
    }
});

module.exports = router;