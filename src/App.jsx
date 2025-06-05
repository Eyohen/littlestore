import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import NotFoundPage from './pages/NotFoundPage';
import { CartProvider } from './context/CartContext';
import TestCoinley from './pages/TestCoinley';
import QuickDemo from './QuickDemo';
import TestQRCode from './pages/TestQRCode';
import StandaloneTest from './pages/StandaloneTest';
import 'coinley-checkout/dist/style.css'



function App() {
  return (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
            <Route path="/standalone" element={<StandaloneTest />} />
            <Route path="/testqrcode" element={<TestQRCode />} />
            <Route path="/quickdemo" element={<QuickDemo />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/test-coinley" element={<TestCoinley />} />
              <Route path="/login" element={<Login />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>

  );
}

export default App;




// // App.js - Test application for Coinley Checkout
// import React, { useRef, useState } from 'react';
// import { ThemeProvider, CoinleyProvider, CoinleyCheckout } from 'coinley-checkout';
// import './App.css';

// function App() {
//   const checkoutRef = useRef(null);
//   const [result, setResult] = useState(null);
//   const [theme, setTheme] = useState('light');
  
//   const toggleTheme = () => {
//     setTheme(prev => prev === 'light' ? 'dark' : 'light');
//   };
  
//   const handlePayment = () => {
//     console.log('Opening payment modal...');
//     checkoutRef.current.open({
//       amount: 1.09,
//       currency: 'USDT',
//       metadata: { orderId: 'test-order-123' }
//     });
//   };
  
//   const handleSuccess = (paymentId, transactionHash) => {
//     console.log('Payment successful!', { paymentId, transactionHash });
//     setResult({
//       status: 'success',
//       paymentId,
//       transactionHash,
//       timestamp: new Date().toISOString()
//     });
    
//     // Show alert after a small delay to make sure state is updated
//     setTimeout(() => {
//       alert(`Payment successful!\nPayment ID: ${paymentId}\nTransaction: ${transactionHash.slice(0, 10)}...`);
//     }, 100);
//   };
  
//   const handleError = (error) => {
//     console.error('Payment error:', error);
//     setResult({
//       status: 'error',
//       message: error.message,
//       timestamp: new Date().toISOString()
//     });
    
//     // Show alert
//     alert(`Payment failed: ${error.message}`);
//   };
  
//   return (
//     <div className="App" style={{
//       backgroundColor: theme === 'dark' ? '#1a202c' : '#f7fafc',
//       color: theme === 'dark' ? '#f7fafc' : '#1a202c',
//       minHeight: '100vh',
//       padding: '2rem'
//     }}>
//       <div style={{ maxWidth: '800px', margin: '0 auto' }}>
//         <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
//           <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
//             Coinley Checkout Test
//           </h1>
//           <p style={{ marginTop: '0.5rem', color: theme === 'dark' ? '#cbd5e0' : '#4a5568' }}>
//             Test the payment flow with a simulated crypto payment
//           </p>
          
//           <button
//             onClick={toggleTheme}
//             style={{
//               padding: '0.5rem 1rem',
//               marginTop: '1rem',
//               backgroundColor: theme === 'dark' ? '#4a5568' : '#edf2f7',
//               color: theme === 'dark' ? '#f7fafc' : '#1a202c',
//               border: 'none',
//               borderRadius: '0.25rem',
//               cursor: 'pointer'
//             }}
//           >
//             Toggle {theme === 'light' ? 'Dark' : 'Light'} Theme
//           </button>
//         </header>
        
//         <div style={{ 
//           backgroundColor: theme === 'dark' ? '#2d3748' : 'white',
//           padding: '2rem',
//           borderRadius: '0.5rem',
//           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
//         }}>
//           <div style={{ marginBottom: '2rem' }}>
//             <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
//               Sample Checkout
//             </h2>
            
//             <div style={{ 
//               padding: '1rem',
//               backgroundColor: theme === 'dark' ? '#4a5568' : '#f7fafc',
//               borderRadius: '0.25rem',
//               marginBottom: '1rem'
//             }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
//                 <span>Product:</span>
//                 <span>Test Item</span>
//               </div>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
//                 <span>Price:</span>
//                 <span>$0.99</span>
//               </div>
//               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
//                 <span>Tax:</span>
//                 <span>$0.10</span>
//               </div>
//               <div style={{ 
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 fontWeight: 'bold',
//                 borderTop: theme === 'dark' ? '1px solid #718096' : '1px solid #e2e8f0',
//                 marginTop: '0.5rem',
//                 paddingTop: '0.5rem'
//               }}>
//                 <span>Total:</span>
//                 <span>$1.09</span>
//               </div>
//             </div>
            
//             <button 
//               onClick={handlePayment}
//               style={{
//                 width: '100%',
//                 padding: '0.75rem 1rem',
//                 fontSize: '1rem',
//                 fontWeight: '600',
//                 backgroundColor: '#3182ce',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '0.25rem',
//                 cursor: 'pointer'
//               }}
//             >
//               Pay with Crypto
//             </button>
//           </div>
          
//           {result && (
//             <div style={{ 
//               marginTop: '2rem',
//               padding: '1rem',
//               backgroundColor: theme === 'dark' ? '#4a5568' : '#f7fafc',
//               borderRadius: '0.25rem'
//             }}>
//               <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
//                 Payment Result:
//               </h3>
//               <pre style={{ 
//                 backgroundColor: theme === 'dark' ? '#2d3748' : '#edf2f7',
//                 padding: '1rem',
//                 borderRadius: '0.25rem',
//                 overflow: 'auto',
//                 fontSize: '0.875rem'
//               }}>
//                 {JSON.stringify(result, null, 2)}
//               </pre>
//             </div>
//           )}
//         </div>
//       </div>
      
//       <ThemeProvider initialTheme={theme}>
//         <CoinleyProvider
//           apiKey="fdb87b029d8fb531589df71e17a8cc55"
//           apiSecret="5fe381f54803f100312117028542e952bd5d3d1d8b8df2dd1d0761c030cda4bf"
//           apiUrl="http://localhost:9000"
//           debug={true}
//         >
//           <CoinleyCheckout
//             ref={checkoutRef}
//             merchantName="Test Store"
//             onSuccess={handleSuccess}
//             onError={handleError}
//             onClose={() => console.log('Payment modal closed')}
//             theme={theme}
//           />
//         </CoinleyProvider>
//       </ThemeProvider>
//     </div>
//   );
// }

// export default App;