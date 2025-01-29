import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { OrderProvider } from './context/OrderContext'
import OrderList from './components/OrderList'
import OrderForm from './components/OrderForm'
import OrderDetails from './components/OrderDetails'

function App() {
  return (
    <OrderProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Modern Tech Header */}
        <header className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(30deg,#0284c722_1px,transparent_1px)] bg-[length:20px_20px]"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto relative">
            <div className="flex items-center justify-center py-6 px-4">
              {/* Title Container */}
              <div className="relative group">
                {/* Glowing Background Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-75 blur 
                              group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                
                {/* Main Title */}
                <div className="relative bg-slate-900/80 backdrop-blur-sm px-6 py-3 rounded-lg shadow-2xl">
                  <div className="flex items-center space-x-3">
                    {/* Icon */}
                    <svg 
                      className="w-8 h-8 text-cyan-400 transform group-hover:rotate-180 transition-transform duration-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                      />
                    </svg>

                    <div>
                      <h1 className="text-3xl font-bold text-transparent bg-clip-text 
                                   bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400">
                        Order Management System
                      </h1>
                      <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-cyan-400 to-blue-400 
                                    transition-all duration-300"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 pt-3 pb-6 animate-fadeIn relative z-10">
          <Routes>
            <Route path="/" element={<Navigate to="/orders" replace />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/new" element={<OrderForm />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/orders/:id/edit" element={<OrderForm />} />
          </Routes>
        </main>
      </div>
    </OrderProvider>
  )
}

export default App
