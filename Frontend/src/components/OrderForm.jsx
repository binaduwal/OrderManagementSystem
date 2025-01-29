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
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? 'Edit Order' : 'Create New Order'}
      </h2>

      {errors.submit && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer Name</label>
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
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
              ${errors.customer ? 'border-red-500' : ''}`}
          />
          {errors.customer && <p className="text-red-500 text-sm mt-1">{errors.customer}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Order Date</label>
          <input
            type="text"
            value={formData.date}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
          />
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <label className="block text-lg font-medium text-gray-700">Items</label>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Add New Item
            </button>
          </div>

          {formData.items.map((item, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Item #{index + 1}</span>
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove Item
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  type="text"
                  placeholder="Enter item name"
                  value={item.itemName}
                  onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                    ${errors[`itemName${index}`] ? 'border-red-500' : ''}`}
                />
                {errors[`itemName${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`itemName${index}`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  placeholder="0"
                  value={item.quantity === 0 ? '' : item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                  min="1"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                    ${errors[`quantity${index}`] ? 'border-red-500' : ''}`}
                />
                {errors[`quantity${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`quantity${index}`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price per Unit (Rs.)</label>
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
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
                    ${errors[`price${index}`] ? 'border-red-500' : ''}`}
                />
                {errors[`price${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`price${index}`]}</p>
                )}
              </div>

              <div className="pt-2 border-t border-gray-200">
                <div className="text-right text-sm font-medium text-gray-700">
                  Item Total: Rs. {(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div className="text-lg font-semibold text-gray-900">
            Order Total: Rs. {formData.total.toFixed(2)}
          </div>
          <div className="space-x-4">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              {isEditing ? 'Update Order' : 'Create Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
    
  );
}

export default OrderForm; 