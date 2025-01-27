import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { OrderProvider } from './context/OrderContext'
import OrderList from './components/OrderList'
import OrderForm from './components/OrderForm'
import OrderDetails from './components/OrderDetails'

// function App() {
//   return (
//     <OrderProvider>
//       <div className="min-h-screen bg-gray-100">
//         {/* Header */}
//         <header className="bg-white shadow">
//           <div className="max-w-7xl mx-auto px-4 py-6">
//             <h1 className="text-3xl font-bold text-gray-900">Order Management System</h1>
//           </div>
//         </header>

//         {/* Main Content */}
//         <main className="max-w-7xl mx-auto px-4 py-6">
//           <Routes>
//             <Route path="/" element={<Navigate to="/orders" replace />} />
//             <Route path="/orders" element={<OrderList />} />
//             <Route path="/orders/new" element={<OrderForm />} />
//             <Route path="/orders/:id" element={<OrderDetails />} />
//             <Route path="/orders/:id/edit" element={<OrderForm />} />
//           </Routes>
//         </main>
//       </div>
//     </OrderProvider>
//   )
// }

function App() {
  return (
    <OrderProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Order Management System</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
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
  );
}
export default App
