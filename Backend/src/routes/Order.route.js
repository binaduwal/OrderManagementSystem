const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Test route working!' });
});

router.post('/', async(req, res) => {
    const {customerName, items,totalPrice} = req.body;
    const order = {
        orderId: Date.now().toString(), 
        customerName,
        orderDate: new Date(),
        items,
        totalPrice
    };
    res.status(201).json({ message: 'Order created successfully!'});
});

//View all orders
router.get('/', (req, res) => {
    res.status(200).json(orders);
})

router.put('/:orderId', async(req, res) => {
    const {orderId} = req.params;
    res.status(200).json({
         message: 'Order updated successfully!', order });
});

//Delete an order
router.delete('/:orderId', async(req, res) => {
    const {orderId} = req.params;
    res.status(200).json({
        message: 'Order deleted successfully!', orderId
    });
});


module.exports = router; 