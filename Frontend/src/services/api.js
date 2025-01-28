// For development
const API_BASE_URL = 'https://ordermanagementsystem.onrender.com';  // Remove /api

const handleResponse = async (response) => {
  const text = await response.text();
  
  try {
    const data = JSON.parse(text);
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (e) {
    throw new Error(text || 'Invalid JSON response');
  }
};

export const fetchOrders = async () => {
  try {
    console.log('Fetching orders from:', `${API_BASE_URL}/orders`);
    const response = await fetch(`${API_BASE_URL}/orders`);
    const data = await handleResponse(response);
    
    return data.order?.map(order => ({
      id: order._id,
      _id: order._id,
      customer: order.customerName || 'No Name',
      total: order.totalPrice || 0,
      date: new Date(order.orderDate).toLocaleDateString(),
      items: order.items || []
    })) || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: orderData.customer,
        items: orderData.items.map(item => ({
          itemName: item.itemName,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price)
        })),
        totalPrice: parseFloat(orderData.total),
        orderDate: new Date().toISOString()
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to create order');
    }
    const data = await response.json();
    return {
      id: data.order._id,
      customer: data.order.customerName,
      total: data.order.totalPrice,
      date: new Date(data.order.orderDate).toLocaleDateString(),
      items: data.order.items
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrder = async (id, orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/update/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: orderData.customer,
        items: orderData.items.map(item => ({
          itemName: item.itemName,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price)
        })),
        totalPrice: parseFloat(orderData.total)
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to update order: ${errorData}`);
    }

    const data = await response.json();
    return {
      id: data.order._id,
      customer: data.order.customerName,
      total: data.order.totalPrice,
      date: new Date(data.order.orderDate).toLocaleDateString(),
      items: data.order.items || []
    };
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export const deleteOrder = async (id) => {
  try {
    const url = `${API_BASE_URL}/orders/delete/${id}`;
    console.log("Making delete request to:", url);
    
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    const data = await handleResponse(response);
    console.log("Delete successful:", data);
    return true;
  } catch (error) {
    console.error("Delete error details:", error.message || error);
    throw error;
  }
};
