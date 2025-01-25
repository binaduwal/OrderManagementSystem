const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
    },
    
    orderDate: {
        type: Date,
        default: Date.now
    },

    items:[{
        itemName: {
            type: String,
        },
        quantity: {
            type: Number,
            min:1
        },
        price: {
            type: Number,
            min:0
        }
    }]
    ,
    totalPrice: {
        type: Number,
        min:0
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
