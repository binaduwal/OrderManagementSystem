import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';

function OrderForm() {
  const { orders, addOrder, editOrder } = useOrders();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    customer: '',
    date: new Date().toLocaleDateString(),
    items: [{ itemName: '', quantity: 1, price: 0 }],
    total: 0
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      const order = orders.find(o => o.id === id);
      if (order) {
        setFormData({
          ...order,
          items: order.items?.length > 0 ? order.items : [{ itemName: '', quantity: 1, price: 0 }]
        });
      }
    }
  }, [id, orders]);

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => {
      const quantity = parseInt(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      return sum + (quantity * price);
    }, 0);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    setFormData({
      ...formData,
      items: newItems,
      total: calculateTotal(newItems)
    });

    if (errors[`${field}${index}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${field}${index}`];
        return newErrors;
      });
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemName: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        items: newItems,
        total: calculateTotal(newItems)
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customer.trim()) newErrors.customer = 'Customer name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    
    formData.items.forEach((item, index) => {
      if (!item.itemName.trim()) newErrors[`itemName${index}`] = 'Item name is required';
      if (!item.quantity || item.quantity <= 0) newErrors[`quantity${index}`] = 'Quantity must be greater than 0';
      if (!item.price || item.price <= 0) newErrors[`price${index}`] = 'Price must be greater than 0';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditing) {
        await editOrder(id, formData);
      } else {
        await addOrder(formData);
      }
      navigate('/orders');
    } catch (error) {
      console.error('Failed to save order:', error);
      setErrors({ submit: 'Failed to save order. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">
          {isEditing ? 'Edit Order' : 'Create New Order'}
        </h2>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-6">
          {errors.submit && (
            <div className="mb-4 p-4 bg-red-900/50 border border-red-500/50 text-red-300 rounded-lg">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Customer Name</label>
              <input
                type="text"
                value={formData.customer}
                onChange={(e) => {
                  setFormData({ ...formData, customer: e.target.value });
                  if (errors.customer) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.customer;
                      return newErrors;
                    });
                  }
                }}
                className={`mt-1 w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-4 py-2.5
                         text-gray-300 placeholder-gray-500
                         focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent
                         transition-all duration-200
                         ${errors.customer ? 'border-red-500/50' : ''}`}
              />
              {errors.customer && <p className="text-red-400 text-sm mt-1">{errors.customer}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Order Date</label>
              <input
                type="text"
                value={formData.date}
                readOnly
                className="mt-1 w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-4 py-2.5
                         text-gray-300 placeholder-gray-500"
              />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="block text-lg font-medium text-gray-300">Items</label>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center px-4 py-2 bg-cyan-600/20 border border-cyan-500/30 
                           text-cyan-300 text-sm font-medium rounded-lg hover:bg-cyan-600/30 
                           transition-colors duration-200"
                >
                  Add New Item
                </button>
              </div>

              {formData.items.map((item, index) => (
                <div key={index} className="bg-gray-900/50 p-4 rounded-lg space-y-4 border border-gray-700/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-400">Item #{index + 1}</span>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-400 hover:text-red-300 text-sm transition-colors duration-200"
                      >
                        Remove Item
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Item Name</label>
                      <input
                        type="text"
                        placeholder="Enter item name"
                        value={item.itemName}
                        onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                        className="mt-1 w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-4 py-2.5
                                 text-gray-300 placeholder-gray-500
                                 focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300">Quantity</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={item.quantity === 0 ? '' : item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                        className="mt-1 w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-4 py-2.5
                                 text-gray-300 placeholder-gray-500
                                 focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300">Price per Unit (Rs.)</label>
                      <input
                        type="text"
                        placeholder="Enter price"
                        value={item.price === 0 ? '' : item.price}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || /^\d*\.?\d*$/.test(value)) {
                            handleItemChange(index, 'price', parseFloat(value) || 0);
                          }
                        }}
                        className="mt-1 w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-4 py-2.5
                                 text-gray-300 placeholder-gray-500
                                 focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
                      />
                    </div>

                    <div className="pt-2 border-t border-gray-700/50">
                      <div className="text-right text-sm font-medium text-gray-300">
                        Item Total: Rs. {(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-700/50">
              <div className="text-lg font-semibold text-gray-300">
                Order Total: Rs. {formData.total.toFixed(2)}
              </div>
              <div className="space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/orders')}
                  className="px-6 py-2.5 bg-gray-700/50 hover:bg-gray-700/70 
                           text-gray-300 font-medium rounded-lg
                           transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 
                           hover:from-cyan-600 hover:to-blue-600
                           text-white font-medium rounded-lg
                           transform hover:-translate-y-0.5 transition-all duration-200
                           shadow-lg hover:shadow-cyan-500/25"
                >
                  {isEditing ? 'Update Order' : 'Create Order'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OrderForm; 