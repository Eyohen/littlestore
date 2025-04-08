import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();

  // Calculate shipping cost (free shipping over $50)
  const shippingCost = subtotal > 50 ? 0 : 0.02;
  
  // Calculate tax (assume 8% tax rate)
  const taxRate = 0.002;
  const tax = subtotal * taxRate;
  
  // Calculate total
  const total = subtotal + shippingCost + tax;

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-lg text-gray-600 mb-6">Your cart is empty</p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id} className="p-4">
                    <div className="flex items-center">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link to={`/products/${item.id}`} className="hover:text-primary">
                            {item.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">${Number (item?.price)?.toFixed(2)} / {item.unit}</p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center ml-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-gray-500 focus:outline-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        <span className="mx-2 text-gray-700 w-8 text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-500 focus:outline-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Item Total */}
                      <div className="ml-4 text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-4 text-red-500 hover:text-red-600 focus:outline-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="text-gray-900 font-medium">${subtotal.toFixed(2)}</p>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping</p>
                  <p className="text-gray-900 font-medium">
                    {shippingCost === 0 
                      ? <span className="text-green-600">Free</span> 
                      : `$${shippingCost.toFixed(2)}`
                    }
                  </p>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-gray-600">Tax (8%)</p>
                  <p className="text-gray-900 font-medium">${tax.toFixed(3)}</p>
                </div>
                
                <div className="border-t pt-4 flex justify-between">
                  <p className="text-lg font-medium text-gray-900">Total</p>
                  <p className="text-lg font-bold text-primary">${total.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Link
                  to="/checkout"
                  className="w-full btn btn-primary flex items-center justify-center"
                >
                  Proceed to Checkout
                </Link>
                
                <Link
                  to="/products"
                  className="w-full mt-4 btn bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center justify-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;