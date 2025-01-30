import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';

function OrderDetails() {
  const { orders, loading, error } = useOrders();
  const { id } = useParams();
  const navigate = useNavigate();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
        <Link to="/orders" className="text-blue-500 hover:text-blue-700 mt-4 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/orders"
              className="flex items-center text-gray-400 hover:text-cyan-400 transition-colors duration-200"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Order Details
            </h2>
          </div>
          <Link
            to={`/orders/${id}/edit`}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 
                     hover:from-cyan-600 hover:to-blue-600
                     text-white px-4 py-2 rounded-lg
                     transform hover:-translate-y-0.5 transition-all duration-200
                     shadow-lg hover:shadow-cyan-500/25
                     flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit Order</span>
          </Link>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-6">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/30">
              <span className="text-gray-400 text-sm">Order ID</span>
              <p className="text-gray-200 font-medium text-lg">#{order.id}</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/30">
              <span className="text-gray-400 text-sm">Order Date</span>
              <p className="text-gray-200 font-medium text-lg">{order.date}</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/30">
              <span className="text-gray-400 text-sm">Customer Name</span>
              <p className="text-gray-200 font-medium text-lg">{order.customer}</p>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/30">
              <span className="text-gray-400 text-sm">Total Amount</span>
              <p className="text-gray-200 font-medium text-lg">Rs. {order.total.toFixed(2)}</p>
            </div>
          </div>

          {order.items && order.items.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-300 mb-4">Order Items</h3>
              <div className="bg-gray-900/30 rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-700/50 text-gray-400 text-sm">
                  <div>Item Name</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-right">Price</div>
                  <div className="text-right">Total</div>
                </div>
                <ul className="divide-y divide-gray-700/50">
                  {order.items.map((item, index) => (
                    <li key={item._id || index} className="p-4">
                      <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300 font-medium">{item.itemName}</div>
                        <div className="text-center text-gray-400">{item.quantity}</div>
                        <div className="text-right text-gray-400">Rs. {item.price}</div>
                        <div className="text-right text-gray-300 font-medium">
                          Rs. {(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between items-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                          bg-cyan-900/30 text-cyan-300 border border-cyan-500/30">
              {order.status}
            </span>
            <div className="text-right">
              <div className="text-gray-400 text-sm">Total Amount</div>
              <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Rs. {order.total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails; 
