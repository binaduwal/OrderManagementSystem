import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';

function OrderList() {
  const { orders, loading, error, removeOrder } = useOrders();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5; // You can adjust this number
  const [deleteError, setDeleteError] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Order ID is undefined.");
      return;
    }
  
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        setDeleteError(null);
        await removeOrder(id);
      } catch (error) {
        setDeleteError(error.message);
        console.error("Failed to delete order:", error);
      }
    }
  };
  
  const handleRowClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-xl text-gray-500">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="text-red-700">{error}</div>
      </div>
    );
  }

  if (deleteError) {
    return (
      <div className="bg-red-50 p-4 rounded-md mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Delete Error</h3>
            <div className="mt-2 text-sm text-red-700">{deleteError}</div>
          </div>
        </div>
      </div>
    );
  }

  // Pagination calculations
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-3 sm:p-6 animate-fadeIn bg-gray-900 min-h-screen">
      {/* Stats Card */}
      <div className="mb-6 sm:mb-8 max-w-[200px]">
        <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl shadow-xl p-4 
                        transform hover:scale-105 transition-all duration-300 backdrop-blur-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className="text-xs sm:text-sm font-medium text-purple-100">Total Orders</h2>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white mt-2 animate-pulse">{orders.length}</p>
        </div>
      </div>

      {/* Orders Table Section */}
      <div className="bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Recent Orders
            </h2>
            <span className="px-3 py-1 text-xs font-medium bg-purple-900/50 text-purple-300 rounded-full">
              {orders.length} total
            </span>
          </div>
          
          {/* Add New Order Button */}
          <Link
            to="/orders/new"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 
                      text-white px-6 py-2.5 rounded-lg shadow-lg hover:shadow-cyan-500/25
                      transform hover:-translate-y-0.5 transition-all duration-200
                      flex items-center space-x-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Order</span>
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first order.</p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <div className="sm:hidden">
              {currentOrders.map((order) => (
                <div
                  key={order._id || order.id}
                  className="p-4 border-b border-gray-700 hover:bg-purple-800/50 cursor-pointer transition-colors duration-200"
                  onClick={() => handleRowClick(order.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-gray-300">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.date}</div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                      #{order.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm font-medium text-gray-300">Rs.{order.total.toFixed(2)}</span>
                    <div className="flex space-x-4">
                      <Link
                        to={`/orders/${order.id}/edit`}
                        className="text-purple-400 hover:text-purple-300 transition-colors duration-200
                                  hover:scale-110 transform inline-flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="sr-only">Edit</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(order._id || order.id);
                        }}
                        className="text-pink-400 hover:text-pink-300 transition-colors duration-200
                                     hover:scale-110 transform"
                      >
                        <span className="sr-only">Delete</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr className="bg-gray-800/50">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-gray-800/30">
                  {currentOrders.map((order) => (
                    <tr
                      key={order._id || order.id}
                      className="hover:bg-cyan-900/10 cursor-pointer transform hover:-translate-y-0.5 transition-all duration-200"
                      onClick={(e) => {
                        if (!e.target.closest('.actions-column')) {
                          handleRowClick(order.id);
                        }
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                          #{order.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-300">{order.customer}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-300">Rs.{order.total.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium actions-column">
                        <div className="flex space-x-4">
                          <Link
                            to={`/orders/${order.id}/edit`}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200
                                      hover:scale-110 transform inline-flex items-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="sr-only">Edit</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(order._id || order.id);
                            }}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200
                                         hover:scale-110 transform"
                          >
                            <span className="sr-only">Delete</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Responsive Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-800 border-t border-gray-700">
                <div className="flex flex-col items-center space-y-3">
                  {/* Page Information */}
                  <p className="text-xs sm:text-sm text-gray-300">
                    Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLastOrder, orders.length)}</span> of{' '}
                    <span className="font-medium">{orders.length}</span> orders
                  </p>

                  {/* Centered Pagination Controls */}
                  <nav className="relative z-0 inline-flex shadow-sm rounded-md space-x-1">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-4 py-2 rounded-md text-sm font-medium
                        ${currentPage === 1
                          ? 'text-gray-500 cursor-not-allowed'
                          : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20 transition-all duration-200'
                        }`}
                    >
                      Previous
                    </button>
                    {/* Show fewer page numbers on mobile */}
                    {[...Array(totalPages)].map((_, index) => {
                      // On mobile, only show current page and adjacent pages
                      if (window.innerWidth < 640 && 
                          (index + 1 < currentPage - 1 || 
                           index + 1 > currentPage + 1)) {
                        return null;
                      }
                      return (
                        <button
                          key={index + 1}
                          onClick={() => paginate(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                            ${currentPage === index + 1
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                              : 'text-gray-300 hover:bg-cyan-900/20 transition-all duration-200'
                            }`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-4 py-2 rounded-md text-sm font-medium
                        ${currentPage === totalPages
                          ? 'text-gray-500 cursor-not-allowed'
                          : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20 transition-all duration-200'
                        }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default OrderList; 
