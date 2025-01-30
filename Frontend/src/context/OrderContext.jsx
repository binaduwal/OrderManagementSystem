import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../services/api";

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Failed to load orders from database ");
      console.error("Error loading orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const addOrder = async (orderData) => {
    try {
      const newOrder = await createOrder(orderData);
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      return newOrder;
    } catch (err) {
      setError("Failed to create order");
      throw err;
    }
  };

  const editOrder = async (id, orderData) => {
    try {
      setError(null);
      const updatedOrder = await updateOrder(id, orderData);
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === id ? updatedOrder : order))
      );
      return updatedOrder;
    } catch (err) {
      setError(`Failed to update order: ${err.message}`);
      throw err;
    }
  };

  // const removeOrder = async (id) => {
  //   try {
  //     setError(null);
  //     const result = await deleteOrder(id);
  //     if (result) {
  //       setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
  //       return true;
  //     }
  //   } catch (err) {
  //     const errorMessage = err.message || 'Failed to delete order';
  //     setError(errorMessage);
  //     throw new Error(errorMessage);
  //   }
  // };

  const removeOrder = async (id) => {
    try {
      console.log("Attempting to remove order with ID:", id);
      if (!id) {
        console.error("Error: Order ID is undefined.");
        return;
      }
      setError(null);

      // Find the order in the current state to get the MongoDB _id
      const orderToDelete = orders.find(order => order.id === id || order._id === id);
      if (!orderToDelete) {
        throw new Error('Order not found in state');
      }

      // Use the MongoDB _id for the API call
      const result = await deleteOrder(orderToDelete._id);
      if (result) {
        // Update the state using the same ID that was used to find the order
        setOrders(prevOrders => prevOrders.filter(order => order.id !== id && order._id !== id));
        console.log("Order successfully removed from state.");
        return true;
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to delete order";
      setError(errorMessage);
      console.error("Error in removeOrder:", errorMessage);
      throw new Error(errorMessage);
    }
  };
  

  const value = {
    orders,
    loading,
    error,
    addOrder,
    editOrder,
    removeOrder,
    refreshOrders: loadOrders,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};
