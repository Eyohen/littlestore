// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import HomePage from './pages/HomePage';
// import Login from './pages/Login';
// import ProductsPage from './pages/ProductsPage';
// import ProductDetailPage from './pages/ProductDetailPage';
// import CartPage from './pages/CartPage';
// import CheckoutPage from './pages/CheckoutPage';
// import OrderSuccessPage from './pages/OrderSuccessPage';
// import NotFoundPage from './pages/NotFoundPage';
// import { CartProvider } from './context/CartContext';
// import 'coinley-checkout/dist/style.css'



// function App() {
//   return (
//         <div className="flex flex-col min-h-screen">
//           <Navbar />
//           <main className="flex-grow">
//             <Routes>
       
//               <Route path="/" element={<HomePage />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/products" element={<ProductsPage />} />
//               <Route path="/products/:id" element={<ProductDetailPage />} />
//               <Route path="/cart" element={<CartPage />} />
//               <Route path="/checkout" element={<CheckoutPage />} />
//               <Route path="/order-success" element={<OrderSuccessPage />} />
//               <Route path="*" element={<NotFoundPage />} />
//             </Routes>
//           </main>
//           <Footer />
//         </div>

//   );
// }

// export default App;



import { Routes, Route } from 'react-router-dom';
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
import CartModal from './components/CartModal'; // Import the new CartModal component
import { useCart } from './context/CartContext'; // Import useCart hook
import 'coinley-checkout/dist/style.css';

function App() {
  // Get cart modal state from context
  const { lastAddedProduct, lastAddedQuantity, showModal, closeModal } = useCart();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Global cart modal - this will appear on any page when item is added to cart */}
        {/* Note: This won't show on ProductDetailPage because that page has its own modal */}
        {!window.location.pathname.includes('/products/') && (
          <CartModal
            showModal={showModal}
            closeModal={closeModal}
            product={lastAddedProduct}
            quantity={lastAddedQuantity}
          />
        )}
        
        <Routes>
          <Route path="/" element={<HomePage />} />
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
