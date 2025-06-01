// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import axios from 'axios';
// import { URL } from '../url';
// import { ThemeProvider, CoinleyProvider, CoinleyCheckout } from 'coinley-checkout';

// function CheckoutPage() {
//     const navigate = useNavigate();
//     const { cartItems, subtotal, clearCart } = useCart();
//     const coinleyCheckoutRef = useRef(null);
    
//     // State for merchant wallet addresses
//     const [merchantWallets, setMerchantWallets] = useState({
//         ethereum: null,
//         solana: null
//     });
    
//     // Fetch merchant wallet addresses on component mount
//     useEffect(() => {
//         // Example fetch from your backend - this would typically be done at the app level
//         const fetchMerchantData = async () => {
//             try {
//                 const response = await axios.get(`${URL}/api/merchant/profile`);
//                 if (response.data && response.data.merchant) {
//                     setMerchantWallets({
//                         ethereum: response.data.merchant.walletAddress,
//                         solana: response.data.merchant.solWalletAddress
//                     });
//                 }
//             } catch (error) {
//                 console.error('Error fetching merchant data:', error);
//             }
//         };
        
//         fetchMerchantData();
//     }, []);
    
//     // Customer information state
//     const [customerInfo, setCustomerInfo] = useState({
//         firstName: '',
//         lastName: '',
//         email: '',
//         address: '',
//         city: '',
//         state: '',
//         zipCode: '',
//         country: 'US',
//         phone: ''
//     });
    
//     // Payment state
//     const [paymentMethod, setPaymentMethod] = useState('coinley');
//     const [processing, setProcessing] = useState(false);
//     const [error, setError] = useState(null);
//     const [currentOrderId, setCurrentOrderId] = useState(null);
    
//     // Calculate order totals - using real cart data from context
//     const shippingCost = subtotal > 50 ? 0 : 0.001;
//     const taxRate = 0.001;
//     const tax = subtotal * taxRate;
//     const total = subtotal + shippingCost + tax;
    
//     // Handle input change
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setCustomerInfo(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };
    
//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setProcessing(true);
//         setError(null);
        
//         try {
//             // Create order object with real cart data
//             const order = {
//                 items: cartItems,
//                 customer: customerInfo,
//                 totals: {
//                     subtotal,
//                     shipping: shippingCost,
//                     tax,
//                     total
//                 },
//                 paymentMethod
//             };
            
//             // Make real API call to create order
//             const orderResponse = await axios.post(`${URL}/api/orders`, order);
//             const orderId = orderResponse.data.id;
            
//             // Store order ID for reference
//             setCurrentOrderId(orderId);
//             localStorage.setItem('currentOrderId', orderId);
            
//             // Initiate payment if crypto payment method is selected
//             if (paymentMethod === 'coinley' && coinleyCheckoutRef.current) {
//                 initiatePayment(orderId);
//             } else {
//                 // Handle other payment methods if needed
//                 setProcessing(false);
//             }
//         } catch (err) {
//             console.error('Checkout error:', err);
//             setError(err.response?.data?.error || 'There was a problem processing your order. Please try again.');
//             setProcessing(false);
//         }
//     };
    
//     // Initialize payment with Coinley
//     const initiatePayment = (orderId) => {
//         if (coinleyCheckoutRef.current) {
//             // Open the checkout with the correct parameters
//             coinleyCheckoutRef.current.open({
//                 amount: total,
//                 currency: 'USDT',
//                 network: 'ethereum',
//                 customerEmail: customerInfo.email,
//                 callbackUrl: `${window.location.origin}/api/webhooks/payments/coinley`, // Your webhook endpoint
//                 metadata: {
//                     orderId: orderId,
//                     customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
//                     items: cartItems.map(item => ({
//                         id: item.id,
//                         name: item.name,
//                         quantity: item.quantity,
//                         price: item.price
//                     }))
//                 }
//             });
//         } else {
//             console.error("Coinley checkout ref is not available");
//             setError("Payment gateway initialization failed. Please try again.");
//             setProcessing(false);
//         }
//     };
    
//     // Handle successful payment
//     const handlePaymentSuccess = async (paymentId, transactionHash) => {
//         try {
//             const orderId = currentOrderId || localStorage.getItem('currentOrderId');
            
//             // Update order with payment details
//             await axios.put(`${URL}/api/orders/${orderId}`, {
//                 paymentStatus: 'paid',
//                 paymentDetails: {
//                     paymentId,
//                     status: 'success',
//                     transactionId: transactionHash,
//                     timestamp: new Date().toISOString()
//                 }
//             });
            
//             // Clear the cart
//             clearCart();
            
//             // Redirect to success page
//             navigate('/order-success', {
//                 state: {
//                     orderId,
//                     total,
//                     paymentDetails: {
//                         transactionId: transactionHash,
//                         paymentId
//                     }
//                 }
//             });
//         } catch (err) {
//             console.error('Payment update error:', err);
//             setError('Payment was received, but we had trouble updating your order. Please contact support.');
//         } finally {
//             setProcessing(false);
//         }
//     };
    
//     // Handle payment error
//     const handlePaymentError = (error) => {
//         console.error('Payment error:', error);
//         setError(`Payment failed: ${error.message || 'Unknown error'}`);
//         setProcessing(false);
//     };
    
//     // Handle closing the payment modal
//     const handleCloseModal = () => {
//         setProcessing(false);
//     };
    
//     return (
//         <div className="container mx-auto py-8 px-4">
//             <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Checkout Form */}
//                 <div>
//                     <form onSubmit={handleSubmit}>
//                         {/* Shipping Information */}
//                         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//                             <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div className="col-span-1">
//                                     <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
//                                         First Name*
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="firstName"
//                                         name="firstName"
//                                         value={customerInfo.firstName}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                     />
//                                 </div>

//                                 {/* Other form fields omitted for brevity */}
//                                 <div className="col-span-1">
//                                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
//                                        Last Name*
//                                    </label>
//                                    <input
//                                        type="text"
//                                        id="lastName"
//                                        name="lastName"
//                                        value={customerInfo.lastName}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    />
//                                </div>

//                                 <div className="col-span-2">
//                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                                        Email Address*
//                                    </label>
//                                    <input
//                                        type="email"
//                                        id="email"
//                                        name="email"
//                                        value={customerInfo.email}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    />
//                                </div>

//                                 <div className="col-span-2">
//                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
//                                        Address*
//                                    </label>
//                                    <input
//                                        type="text"
//                                        id="address"
//                                        name="address"
//                                        value={customerInfo.address}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    />
//                                </div>

//                                 <div className="col-span-1">
//                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
//                                        City*
//                                    </label>
//                                    <input
//                                        type="text"
//                                        id="city"
//                                        name="city"
//                                        value={customerInfo.city}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    />
//                                </div>

//                                 <div className="col-span-1">
//                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
//                                        State/Province*
//                                    </label>
//                                    <input
//                                        type="text"
//                                        id="state"
//                                        name="state"
//                                        value={customerInfo.state}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    />
//                                </div>

//                                 <div className="col-span-1">
//                                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
//                                        ZIP/Postal Code*
//                                    </label>
//                                    <input
//                                        type="text"
//                                        id="zipCode"
//                                        name="zipCode"
//                                        value={customerInfo.zipCode}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    />
//                                </div>

//                                 <div className="col-span-1">
//                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
//                                        Country*
//                                    </label>
//                                    <select
//                                        id="country"
//                                        name="country"
//                                        value={customerInfo.country}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    >
//                                        <option value="US">United States</option>
//                                        <option value="CA">Canada</option>
//                                        <option value="UK">United Kingdom</option>
//                                        <option value="AU">Australia</option>
//                                    </select>
//                                </div>

//                                 <div className="col-span-2">
//                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//                                        Phone Number*
//                                    </label>
//                                    <input
//                                        type="tel"
//                                        id="phone"
//                                        name="phone"
//                                        value={customerInfo.phone}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                      />
//                                 </div>
                                
//                             </div>
//                         </div>

//                         {/* Payment Method */}
//                         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//                             <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

//                             <div className="space-y-4">
//                                 <div className="flex items-center">
//                                     <input
//                                         id="coinley"
//                                         name="paymentMethod"
//                                         type="radio"
//                                         checked={paymentMethod === 'coinley'}
//                                         onChange={() => setPaymentMethod('coinley')}
//                                         className="h-4 w-4 text-blue-600 focus:ring-[#7042D2] border-gray-300"
//                                     />
//                                     <label htmlFor="coinley" className="ml-3 block text-sm font-medium text-gray-700">
//                                         Pay with Cryptocurrency
//                                     </label>
//                                 </div>

//                                 {paymentMethod === 'coinley' && (
//                                     <div className="ml-7 mt-2 bg-blue-50 p-3 rounded-md">
//                                         <p className="text-sm text-blue-700">
//                                             You'll be redirected to complete the payment securely using our cryptocurrency gateway.
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Submit Order */}
//                         <div className="bg-white rounded-lg shadow-md p-6">
//                             {error && (
//                                 <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
//                                     {error}
//                                 </div>
//                             )}

//                             <button
//                                 type="submit"
//                                 className="w-full py-2 px-4 bg-[#7042D2] hover:bg-[#7042D2] text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7042D2]"
//                                 disabled={processing}
//                             >
//                                 {processing ? (
//                                     <span className="flex items-center justify-center">
//                                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                         Processing...
//                                     </span>
//                                 ) : (
//                                     'Place Order'
//                                 )}
//                             </button>
//                         </div>
//                     </form>
//                 </div>

//                 {/* Order Summary */}
//                 <div>
//                     <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
//                         <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

//                         <div className="max-h-80 overflow-y-auto mb-4">
//                             <ul className="divide-y divide-gray-200">
//                                 {cartItems.map((item) => (
//                                     <li key={item.id} className="py-3 flex items-center">
//                                         {/* Item details omitted for brevity */}
//                                         <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
//                                              {item.imageUrl ? (
//                                                  <img 
//                                                      src={item.imageUrl} 
//                                                      alt={item.name} 
//                                                      className="w-full h-full object-cover"
//                                                  />
//                                              ) : (
//                                                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                                                      <span className="text-gray-400">{item.name[0]}</span>
//                                                  </div>
//                                              )}
//                                          </div>
//                                          <div className="ml-3 flex-1">
//                                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
//                                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                                          </div>
//                                          <p className="text-sm font-medium text-gray-900">
//                                              ${(item.price * item.quantity).toFixed(2)}
//                                          </p>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>

//                         <div className="space-y-3 border-t pt-3">
//                             <div className="flex justify-between">
//                                 <p className="text-sm text-gray-600">Subtotal</p>
//                                 <p className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</p>
//                             </div>

//                             <div className="flex justify-between">
//                                 <p className="text-sm text-gray-600">Shipping</p>
//                                 <p className="text-sm font-medium text-gray-900">
//                                     {shippingCost === 0
//                                         ? <span className="text-green-600">Free</span>
//                                         : `$${shippingCost.toFixed(2)}`
//                                     }
//                                 </p>
//                             </div>

//                             <div className="flex justify-between">
//                                 <p className="text-sm text-gray-600">Tax (8%)</p>
//                                 <p className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</p>
//                             </div>

//                             <div className="flex justify-between border-t pt-3">
//                                 <p className="text-base font-medium text-gray-900">Total</p>
//                                 <p className="text-base font-bold text-blue-600">${total.toFixed(2)}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Coinley Checkout Component - UPDATED IMPLEMENTATION */}
//             <ThemeProvider initialTheme="light">
//                 <CoinleyProvider
//                     apiKey="afb78ff958350b9067798dd077c28459"
//                     apiSecret="c22d3879eff18c2d3f8f8a61d4097c230a940356a3d139ffceee11ba65b1a34c"
//                     apiUrl="https://coinleyserver-production.up.railway.app"
//                     merchantWalletAddress="0x581c333Ca62d04bADb563750535C935516b90839"
//                     //debug={process.env.NODE_ENV === 'development'}
//                     //merchantSolWalletAddress={merchantWallets.solana} // Pass Solana wallet address directly
//                 >
//                     <CoinleyCheckout
//                         ref={coinleyCheckoutRef}
//                         customerEmail={customerInfo.email || ''}
//                         merchantName="FreshBites"
//                         onSuccess={handlePaymentSuccess}
//                         onError={handlePaymentError}
//                         onClose={handleCloseModal}
//                         theme="light"
//                         autoOpen={false}
//                         testMode={false}
//                         preferredNetwork="ethereum" 
//                         preferredWallet="metamask"
//                     />
//                 </CoinleyProvider>
//             </ThemeProvider>
//         </div>
//     );
// }

// export default CheckoutPage;

















// // CheckoutPage.jsx - Fixed implementation with proper imports
// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import axios from 'axios';
// import { URL } from '../url';

// // Import the SDK components and constants properly
// import { 
//   ThemeProvider, 
//   CoinleyProvider, 
//   CoinleyCheckout,
//   NETWORK_TYPES // This should now be properly exported
// } from 'coinley-checkout';

// function CheckoutPage() {
//     const navigate = useNavigate();
//     const { cartItems, subtotal, clearCart } = useCart();
//     const coinleyCheckoutRef = useRef(null);
    
//     // Customer information state
//     const [customerInfo, setCustomerInfo] = useState({
//         firstName: '',
//         lastName: '',
//         email: '',
//         address: '',
//         city: '',
//         state: '',
//         zipCode: '',
//         country: 'US',
//         phone: ''
//     });
    
//     // Payment state
//     const [paymentMethod, setPaymentMethod] = useState('coinley');
//     const [processing, setProcessing] = useState(false);
//     const [error, setError] = useState(null);
//     const [currentOrderId, setCurrentOrderId] = useState(null);
    
//     // Calculate order totals
//     const shippingCost = subtotal > 50 ? 0 : 0.001;
//     const taxRate = 0.001;
//     const tax = subtotal * taxRate;
//     const total = subtotal + shippingCost + tax;
    
//     // Debug: Check if NETWORK_TYPES is properly imported
//     useEffect(() => {
//         console.log('NETWORK_TYPES:', NETWORK_TYPES);
//         if (!NETWORK_TYPES) {
//             console.error('NETWORK_TYPES not imported properly from coinley-checkout');
//         }
//     }, []);
    
//     // Handle input change
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setCustomerInfo(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };
    
//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setProcessing(true);
//         setError(null);
        
//         try {
//             // Create order object with real cart data
//             const order = {
//                 items: cartItems,
//                 customer: customerInfo,
//                 totals: {
//                     subtotal,
//                     shipping: shippingCost,
//                     tax,
//                     total
//                 },
//                 paymentMethod
//             };
            
//             // Make real API call to create order
//             const orderResponse = await axios.post(`${URL}/api/orders`, order);
//             const orderId = orderResponse.data.id;
            
//             // Store order ID for reference
//             setCurrentOrderId(orderId);
//             localStorage.setItem('currentOrderId', orderId);
            
//             // Initiate payment if crypto payment method is selected
//             if (paymentMethod === 'coinley' && coinleyCheckoutRef.current) {
//                 initiatePayment(orderId);
//             } else {
//                 setProcessing(false);
//             }
//         } catch (err) {
//             console.error('Checkout error:', err);
//             setError(err.response?.data?.error || 'There was a problem processing your order. Please try again.');
//             setProcessing(false);
//         }
//     };
    
//     // Initialize payment with Coinley
//     const initiatePayment = (orderId) => {
//         if (coinleyCheckoutRef.current) {
//             coinleyCheckoutRef.current.open({
//                 amount: total,
//                 currency: 'USDT',
//                 customerEmail: customerInfo.email,
//                 callbackUrl: `${window.location.origin}/api/webhooks/payments/coinley`,
//                 metadata: {
//                     orderId: orderId,
//                     customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
//                     items: cartItems.map(item => ({
//                         id: item.id,
//                         name: item.name,
//                         quantity: item.quantity,
//                         price: item.price
//                     }))
//                 }
//             });
//         } else {
//             console.error("Coinley checkout ref is not available");
//             setError("Payment gateway initialization failed. Please try again.");
//             setProcessing(false);
//         }
//     };
    
//     // Handle successful payment
//     const handlePaymentSuccess = async (paymentId, transactionHash, paymentDetails) => {
//         try {
//             const orderId = currentOrderId || localStorage.getItem('currentOrderId');
            
//             // Update order with payment details
//             await axios.put(`${URL}/api/orders/${orderId}`, {
//                 paymentStatus: 'paid',
//                 paymentDetails: {
//                     paymentId,
//                     status: 'success',
//                     transactionId: transactionHash,
//                     network: paymentDetails?.network || 'unknown',
//                     currency: paymentDetails?.currency || 'USDT',
//                     amount: paymentDetails?.amount || total,
//                     timestamp: new Date().toISOString()
//                 }
//             });
            
//             // Clear the cart
//             clearCart();
            
//             // Redirect to success page
//             navigate('/order-success', {
//                 state: {
//                     orderId,
//                     total,
//                     paymentDetails: {
//                         transactionId: transactionHash,
//                         paymentId,
//                         network: paymentDetails?.network,
//                         currency: paymentDetails?.currency
//                     }
//                 }
//             });
//         } catch (err) {
//             console.error('Payment update error:', err);
//             setError('Payment was received, but we had trouble updating your order. Please contact support.');
//         } finally {
//             setProcessing(false);
//         }
//     };
    
//     // Handle payment error
//     const handlePaymentError = (error) => {
//         console.error('Payment error:', error);
//         setError(`Payment failed: ${error.message || 'Unknown error'}`);
//         setProcessing(false);
//     };
    
//     // Handle closing the payment modal
//     const handleCloseModal = () => {
//         setProcessing(false);
//     };
    
//     // Define network constants locally if import fails
//     const SAFE_NETWORK_TYPES = NETWORK_TYPES || {
//         ETHEREUM: 'ethereum',
//         BSC: 'bsc',
//         TRON: 'tron',
//         ALGORAND: 'algorand'
//     };
    
//     return (
//         <div className="container mx-auto py-8 px-4">
//             <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Checkout Form */}
//                 <div>
//                     <form onSubmit={handleSubmit}>
//                         {/* Shipping Information */}
//                         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//                             <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div className="col-span-1">
//                                     <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
//                                         First Name*
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="firstName"
//                                         name="firstName"
//                                         value={customerInfo.firstName}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                     />
//                                 </div>

//                                 <div className="col-span-1">
//                                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
//                                        Last Name*
//                                    </label>
//                                    <input
//                                        type="text"
//                                        id="lastName"
//                                        name="lastName"
//                                        value={customerInfo.lastName}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    />
//                                </div>

//                                 <div className="col-span-2">
//                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                                        Email Address*
//                                    </label>
//                                    <input
//                                        type="email"
//                                        id="email"
//                                        name="email"
//                                        value={customerInfo.email}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    />
//                                </div>

//                                 <div className="col-span-2">
//                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
//                                        Address*
//                                    </label>
//                                    <input
//                                        type="text"
//                                        id="address"
//                                        name="address"
//                                        value={customerInfo.address}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    />
//                                </div>

//                                 <div className="col-span-1">
//                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
//                                        City*
//                                    </label>
//                                    <input
//                                        type="text"
//                                        id="city"
//                                        name="city"
//                                        value={customerInfo.city}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    />
//                                </div>

//                                 <div className="col-span-1">
//                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
//                                        State/Province*
//                                    </label>
//                                    <input
//                                        type="text"
//                                        id="state"
//                                        name="state"
//                                        value={customerInfo.state}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    />
//                                </div>

//                                 <div className="col-span-1">
//                                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
//                                        ZIP/Postal Code*
//                                    </label>
//                                    <input
//                                        type="text"
//                                        id="zipCode"
//                                        name="zipCode"
//                                        value={customerInfo.zipCode}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    />
//                                </div>

//                                 <div className="col-span-1">
//                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
//                                        Country*
//                                    </label>
//                                    <select
//                                        id="country"
//                                        name="country"
//                                        value={customerInfo.country}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    >
//                                        <option value="US">United States</option>
//                                        <option value="CA">Canada</option>
//                                        <option value="UK">United Kingdom</option>
//                                        <option value="AU">Australia</option>
//                                    </select>
//                                </div>

//                                 <div className="col-span-2">
//                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//                                        Phone Number*
//                                    </label>
//                                    <input
//                                        type="tel"
//                                        id="phone"
//                                        name="phone"
//                                        value={customerInfo.phone}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                      />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Payment Method */}
//                         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//                             <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

//                             <div className="space-y-4">
//                                 <div className="flex items-center">
//                                     <input
//                                         id="coinley"
//                                         name="paymentMethod"
//                                         type="radio"
//                                         checked={paymentMethod === 'coinley'}
//                                         onChange={() => setPaymentMethod('coinley')}
//                                         className="h-4 w-4 text-blue-600 focus:ring-[#7042D2] border-gray-300"
//                                     />
//                                     <label htmlFor="coinley" className="ml-3 block text-sm font-medium text-gray-700">
//                                         Pay with Cryptocurrency
//                                     </label>
//                                 </div>

//                                 {paymentMethod === 'coinley' && (
//                                     <div className="ml-7 mt-2 bg-blue-50 p-3 rounded-md">
//                                         <p className="text-sm text-blue-700">
//                                             Accept payments in USDT, USDC, ETH, BNB, TRX, and ALGO across multiple networks.
//                                             Your customers can pay using MetaMask, TronLink, Trust Wallet, or Lute Wallet.
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Submit Order */}
//                         <div className="bg-white rounded-lg shadow-md p-6">
//                             {error && (
//                                 <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
//                                     {error}
//                                 </div>
//                             )}

//                             <button
//                                 type="submit"
//                                 className="w-full py-2 px-4 bg-[#7042D2] hover:bg-[#7042D2] text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7042D2]"
//                                 disabled={processing}
//                             >
//                                 {processing ? (
//                                     <span className="flex items-center justify-center">
//                                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                         Processing...
//                                     </span>
//                                 ) : (
//                                     'Place Order'
//                                 )}
//                             </button>
//                         </div>
//                     </form>
//                 </div>

//                 {/* Order Summary */}
//                 <div>
//                     <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
//                         <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

//                         <div className="max-h-80 overflow-y-auto mb-4">
//                             <ul className="divide-y divide-gray-200">
//                                 {cartItems.map((item) => (
//                                     <li key={item.id} className="py-3 flex items-center">
//                                         <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
//                                              {item.imageUrl ? (
//                                                  <img 
//                                                      src={item.imageUrl} 
//                                                      alt={item.name} 
//                                                      className="w-full h-full object-cover"
//                                                  />
//                                              ) : (
//                                                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                                                      <span className="text-gray-400">{item.name[0]}</span>
//                                                  </div>
//                                              )}
//                                          </div>
//                                          <div className="ml-3 flex-1">
//                                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
//                                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                                          </div>
//                                          <p className="text-sm font-medium text-gray-900">
//                                              ${(item.price * item.quantity).toFixed(2)}
//                                          </p>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>

//                         <div className="space-y-3 border-t pt-3">
//                             <div className="flex justify-between">
//                                 <p className="text-sm text-gray-600">Subtotal</p>
//                                 <p className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</p>
//                             </div>

//                             <div className="flex justify-between">
//                                 <p className="text-sm text-gray-600">Shipping</p>
//                                 <p className="text-sm font-medium text-gray-900">
//                                     {shippingCost === 0
//                                         ? <span className="text-green-600">Free</span>
//                                         : `$${shippingCost.toFixed(2)}`
//                                     }
//                                 </p>
//                             </div>

//                             <div className="flex justify-between">
//                                 <p className="text-sm text-gray-600">Tax (8%)</p>
//                                 <p className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</p>
//                             </div>

//                             <div className="flex justify-between border-t pt-3">
//                                 <p className="text-base font-medium text-gray-900">Total</p>
//                                 <p className="text-base font-bold text-blue-600">${total.toFixed(2)}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Enhanced Coinley Checkout Component with error handling */}
//             <ThemeProvider initialTheme="light">
//                 <CoinleyProvider
//                   apiKey="fdb87b029d8fb531589df71e17a8cc55"
//                   apiSecret="5fe381f54803f100312117028542e952bd5d3d1d8b8df2dd1d0761c030cda4bf"
//                   apiUrl="http://localhost:9000"
//                   merchantWalletAddresses={{
//                         [SAFE_NETWORK_TYPES.ETHEREUM]: "0x581c333Ca62d04bADb563750535C935516b90839",
//                         [SAFE_NETWORK_TYPES.BSC]: "0x581c333Ca62d04bADb563750535C935516b90839",
//                         [SAFE_NETWORK_TYPES.TRON]: "TYourTronWalletAddressHere",
//                         [SAFE_NETWORK_TYPES.ALGORAND]: "YourAlgorandWalletAddressHere"
//                     }}
//                     debug={process.env.NODE_ENV === 'development'}
//                 >
//                     <CoinleyCheckout
//                         ref={coinleyCheckoutRef}
//                         customerEmail={customerInfo.email || ''}
//                         merchantName="FreshBites"
//                         onSuccess={handlePaymentSuccess}
//                         onError={handlePaymentError}
//                         onClose={handleCloseModal}
//                         theme="light"
//                         autoOpen={false}
//                         testMode={false}
//                         supportedNetworks={[
//                             SAFE_NETWORK_TYPES.ETHEREUM, 
//                             SAFE_NETWORK_TYPES.BSC, 
//                             SAFE_NETWORK_TYPES.TRON
//                         ]}
//                     />
//                 </CoinleyProvider>
//             </ThemeProvider>
//         </div>
//     );
// }

// export default CheckoutPage;






// // CheckoutPage.jsx 
// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import axios from 'axios';
// import { URL } from '../url';

// // Import the SDK components and constants properly
// import { 
//   ThemeProvider, 
//   CoinleyProvider, 
//   CoinleyCheckout,
//   NETWORK_TYPES
// } from 'coinley-checkout';

// function CheckoutPage() {
//     const navigate = useNavigate();
//     const { cartItems, subtotal, clearCart } = useCart();
//     const coinleyCheckoutRef = useRef(null);
    
//     // Customer information state
//     const [customerInfo, setCustomerInfo] = useState({
//         firstName: '',
//         lastName: '',
//         email: '',
//         address: '',
//         city: '',
//         state: '',
//         zipCode: '',
//         country: 'US',
//         phone: ''
//     });
    
//     // Payment state
//     const [paymentMethod, setPaymentMethod] = useState('coinley');
//     const [processing, setProcessing] = useState(false);
//     const [error, setError] = useState(null);
//     const [currentOrderId, setCurrentOrderId] = useState(null);
    
//     // Calculate order totals
//     const shippingCost = subtotal > 50 ? 0 : 0.001;
//     const taxRate = 0.001;
//     const tax = subtotal * taxRate;
//     const total = subtotal + shippingCost + tax;
    
//     // Define network constants locally if import fails - FIXED
//     const SAFE_NETWORK_TYPES = NETWORK_TYPES || {
//         ETHEREUM: 'ethereum',
//         BSC: 'bsc',
//         TRON: 'tron',
//         ALGORAND: 'algorand'
//     };

//     // FIXED: Define merchant wallet addresses properly
//     const merchantWalletAddresses = {
//         [SAFE_NETWORK_TYPES.ETHEREUM]: "0x581c333Ca62d04bADb563750535C935516b90839",
//         [SAFE_NETWORK_TYPES.BSC]: "0x581c333Ca62d04bADb563750535C935516b90839",
//         [SAFE_NETWORK_TYPES.TRON]: "TV3d7eKYnaV4NVbwrqEPoyib9yXbZUYEBJ",
//         [SAFE_NETWORK_TYPES.ALGORAND]: "YourAlgorandWalletAddressHere"
//     };
    
//     // Debug: Check if NETWORK_TYPES is properly imported
//     useEffect(() => {
//         console.log('NETWORK_TYPES:', NETWORK_TYPES);
//         console.log('SAFE_NETWORK_TYPES:', SAFE_NETWORK_TYPES);
//         console.log('merchantWalletAddresses:', merchantWalletAddresses);
//         if (!NETWORK_TYPES) {
//             console.error('NETWORK_TYPES not imported properly from coinley-checkout');
//         }
//     }, []);
    
//     // Handle input change
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setCustomerInfo(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };
    
//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setProcessing(true);
//         setError(null);
        
//         try {
//             // Create order object with real cart data
//             const order = {
//                 items: cartItems,
//                 customer: customerInfo,
//                 totals: {
//                     subtotal,
//                     shipping: shippingCost,
//                     tax,
//                     total
//                 },
//                 paymentMethod
//             };
            
//             // Make real API call to create order
//             const orderResponse = await axios.post(`${URL}/api/orders`, order);
//             const orderId = orderResponse.data.id;
            
//             // Store order ID for reference
//             setCurrentOrderId(orderId);
//             localStorage.setItem('currentOrderId', orderId);
            
//             // Initiate payment if crypto payment method is selected
//             if (paymentMethod === 'coinley' && coinleyCheckoutRef.current) {
//                 initiatePayment(orderId);
//             } else {
//                 setProcessing(false);
//             }
//         } catch (err) {
//             console.error('Checkout error:', err);
//             setError(err.response?.data?.error || 'There was a problem processing your order. Please try again.');
//             setProcessing(false);
//         }
//     };
    
//     // FIXED: Initialize payment with Coinley - pass merchant wallet addresses
//     const initiatePayment = (orderId) => {
//         if (coinleyCheckoutRef.current) {
//             console.log('Initiating payment with addresses:', merchantWalletAddresses);
//             coinleyCheckoutRef.current.open({
//                 amount: total,
//                 currency: 'USDT',
//                 customerEmail: customerInfo.email,
//                 callbackUrl: `${window.location.origin}/api/webhooks/payments/coinley`,
//                 merchantWalletAddresses: merchantWalletAddresses, // FIXED: Pass wallet addresses here
//                 metadata: {
//                     orderId: orderId,
//                     customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
//                     items: cartItems.map(item => ({
//                         id: item.id,
//                         name: item.name,
//                         quantity: item.quantity,
//                         price: item.price
//                     }))
//                 }
//             });
//         } else {
//             console.error("Coinley checkout ref is not available");
//             setError("Payment gateway initialization failed. Please try again.");
//             setProcessing(false);
//         }
//     };
    
//     // Handle successful payment
//     const handlePaymentSuccess = async (paymentId, transactionHash, paymentDetails) => {
//         try {
//             const orderId = currentOrderId || localStorage.getItem('currentOrderId');
            
//             // Update order with payment details
//             await axios.put(`${URL}/api/orders/${orderId}`, {
//                 paymentStatus: 'paid',
//                 paymentDetails: {
//                     paymentId,
//                     status: 'success',
//                     transactionId: transactionHash,
//                     network: paymentDetails?.network || 'unknown',
//                     currency: paymentDetails?.currency || 'USDT',
//                     amount: paymentDetails?.amount || total,
//                     timestamp: new Date().toISOString()
//                 }
//             });
            
//             // Clear the cart
//             clearCart();
            
//             // Redirect to success page
//             navigate('/order-success', {
//                 state: {
//                     orderId,
//                     total,
//                     paymentDetails: {
//                         transactionId: transactionHash,
//                         paymentId,
//                         network: paymentDetails?.network,
//                         currency: paymentDetails?.currency
//                     }
//                 }
//             });
//         } catch (err) {
//             console.error('Payment update error:', err);
//             setError('Payment was received, but we had trouble updating your order. Please contact support.');
//         } finally {
//             setProcessing(false);
//         }
//     };
    
//     // Handle payment error
//     const handlePaymentError = (error) => {
//         console.error('Payment error:', error);
//         setError(`Payment failed: ${error.message || 'Unknown error'}`);
//         setProcessing(false);
//     };
    
//     // Handle closing the payment modal
//     const handleCloseModal = () => {
//         setProcessing(false);
//     };
    
//     return (
//         <div className="container mx-auto py-8 px-4">
//             <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Checkout Form */}
//                 <div>
//                     <form onSubmit={handleSubmit}>
//                         {/* Shipping Information */}
//                         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//                             <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div className="col-span-1">
//                                     <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
//                                         First Name*
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="firstName"
//                                         name="firstName"
//                                         value={customerInfo.firstName}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                     />
//                                 </div>

//                                 <div className="col-span-1">
//                                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
//                                        Last Name*
//                                    </label>
//                                    <input
//                                        type="text"
//                                        id="lastName"
//                                        name="lastName"
//                                        value={customerInfo.lastName}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    />
//                                </div>

//                                 <div className="col-span-2">
//                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                                        Email Address*
//                                    </label>
//                                    <input
//                                        type="email"
//                                        id="email"
//                                        name="email"
//                                        value={customerInfo.email}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    />
//                                </div>

//                                 <div className="col-span-2">
//                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
//                                        Address*
//                                    </label>
//                                    <input
//                                        type="text"
//                                        id="address"
//                                        name="address"
//                                        value={customerInfo.address}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    />
//                                </div>

//                                 <div className="col-span-1">
//                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
//                                        City*
//                                    </label>
//                                    <input
//                                        type="text"
//                                        id="city"
//                                        name="city"
//                                        value={customerInfo.city}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    />
//                                </div>

//                                 <div className="col-span-1">
//                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
//                                        State/Province*
//                                    </label>
//                                    <input
//                                        type="text"
//                                        id="state"
//                                        name="state"
//                                        value={customerInfo.state}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    />
//                                </div>

//                                 <div className="col-span-1">
//                                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
//                                        ZIP/Postal Code*
//                                    </label>
//                                    <input
//                                        type="text"
//                                        id="zipCode"
//                                        name="zipCode"
//                                        value={customerInfo.zipCode}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    />
//                                </div>

//                                 <div className="col-span-1">
//                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
//                                        Country*
//                                    </label>
//                                    <select
//                                        id="country"
//                                        name="country"
//                                        value={customerInfo.country}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                    >
//                                        <option value="US">United States</option>
//                                        <option value="CA">Canada</option>
//                                        <option value="UK">United Kingdom</option>
//                                        <option value="AU">Australia</option>
//                                    </select>
//                                </div>

//                                 <div className="col-span-2">
//                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//                                        Phone Number*
//                                    </label>
//                                    <input
//                                        type="tel"
//                                        id="phone"
//                                        name="phone"
//                                        value={customerInfo.phone}
//                                        onChange={handleInputChange}
//                                        required
//                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
//                                      />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Payment Method */}
//                         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//                             <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

//                             <div className="space-y-4">
//                                 <div className="flex items-center">
//                                     <input
//                                         id="coinley"
//                                         name="paymentMethod"
//                                         type="radio"
//                                         checked={paymentMethod === 'coinley'}
//                                         onChange={() => setPaymentMethod('coinley')}
//                                         className="h-4 w-4 text-blue-600 focus:ring-[#7042D2] border-gray-300"
//                                     />
//                                     <label htmlFor="coinley" className="ml-3 block text-sm font-medium text-gray-700">
//                                         Pay with Cryptocurrency
//                                     </label>
//                                 </div>

//                                 {paymentMethod === 'coinley' && (
//                                     <div className="ml-7 mt-2 bg-blue-50 p-3 rounded-md">
//                                         <p className="text-sm text-blue-700">
//                                             Accept payments in USDT, USDC, PYUSD, FRAX, DAI, ETH, BNB, TRX, and ALGO across multiple networks.
//                                             Your customers can pay using MetaMask, TronLink, Trust Wallet, or Lute Wallet.
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Submit Order */}
//                         <div className="bg-white rounded-lg shadow-md p-6">
//                             {error && (
//                                 <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
//                                     {error}
//                                 </div>
//                             )}

//                             <button
//                                 type="submit"
//                                 className="w-full py-2 px-4 bg-[#7042D2] hover:bg-[#7042D2] text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7042D2]"
//                                 disabled={processing}
//                             >
//                                 {processing ? (
//                                     <span className="flex items-center justify-center">
//                                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                         Processing...
//                                     </span>
//                                 ) : (
//                                     'Place Order'
//                                 )}
//                             </button>
//                         </div>
//                     </form>
//                 </div>

//                 {/* Order Summary */}
//                 <div>
//                     <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
//                         <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

//                         <div className="max-h-80 overflow-y-auto mb-4">
//                             <ul className="divide-y divide-gray-200">
//                                 {cartItems.map((item) => (
//                                     <li key={item.id} className="py-3 flex items-center">
//                                         <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
//                                              {item.imageUrl ? (
//                                                  <img 
//                                                      src={item.imageUrl} 
//                                                      alt={item.name} 
//                                                      className="w-full h-full object-cover"
//                                                  />
//                                              ) : (
//                                                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
//                                                      <span className="text-gray-400">{item.name[0]}</span>
//                                                  </div>
//                                              )}
//                                          </div>
//                                          <div className="ml-3 flex-1">
//                                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
//                                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                                          </div>
//                                          <p className="text-sm font-medium text-gray-900">
//                                              ${(item.price * item.quantity).toFixed(2)}
//                                          </p>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>

//                         <div className="space-y-3 border-t pt-3">
//                             <div className="flex justify-between">
//                                 <p className="text-sm text-gray-600">Subtotal</p>
//                                 <p className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</p>
//                             </div>

//                             <div className="flex justify-between">
//                                 <p className="text-sm text-gray-600">Shipping</p>
//                                 <p className="text-sm font-medium text-gray-900">
//                                     {shippingCost === 0
//                                         ? <span className="text-green-600">Free</span>
//                                         : `$${shippingCost.toFixed(2)}`
//                                     }
//                                 </p>
//                             </div>

//                             <div className="flex justify-between">
//                                 <p className="text-sm text-gray-600">Tax (8%)</p>
//                                 <p className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</p>
//                             </div>

//                             <div className="flex justify-between border-t pt-3">
//                                 <p className="text-base font-medium text-gray-900">Total</p>
//                                 <p className="text-base font-bold text-blue-600">${total.toFixed(2)}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* FIXED: Enhanced Coinley Checkout Component */}
//             <ThemeProvider initialTheme="light">
//                 <CoinleyProvider
//                     // apiKey="fdb87b029d8fb531589df71e17a8cc55"
//                     // apiSecret="5fe381f54803f100312117028542e952bd5d3d1d8b8df2dd1d0761c030cda4bf"
//                     apiKey="afb78ff958350b9067798dd077c28459"
//                     apiSecret="c22d3879eff18c2d3f8f8a61d4097c230a940356a3d139ffceee11ba65b1a34c"
//                     apiUrl="https://coinleyserver-production.up.railway.app"
//                     debug={process.env.NODE_ENV === 'development'}
//                 >
//                     <CoinleyCheckout
//                         ref={coinleyCheckoutRef}
//                         customerEmail={customerInfo.email || ''}
//                         merchantName="FreshBites"
//                         merchantWalletAddresses={merchantWalletAddresses}
//                         onSuccess={handlePaymentSuccess}
//                         onError={handlePaymentError}
//                         onClose={handleCloseModal}
//                         theme="light"
//                         autoOpen={false}
//                         testMode={false}
//                         supportedNetworks={[
//                             SAFE_NETWORK_TYPES.ETHEREUM, 
//                             SAFE_NETWORK_TYPES.BSC, 
//                             SAFE_NETWORK_TYPES.TRON,
//                             SAFE_NETWORK_TYPES.ALGORAND
//                         ]}
//                     />
//                 </CoinleyProvider>
//             </ThemeProvider>
//         </div>
//     );
// }

// export default CheckoutPage;





// CheckoutPage.jsx - Updated with Flexible Wallet Address Management
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { URL } from '../url';

// Import the SDK components and constants
import { 
  ThemeProvider, 
  CoinleyProvider, 
  CoinleyCheckout,
  NETWORK_TYPES,
  WALLET_TYPES,
  TOKEN_CONFIG
} from 'coinley-checkout';

function CheckoutPage() {
    const navigate = useNavigate();
    const { cartItems, subtotal, clearCart } = useCart();
    const coinleyCheckoutRef = useRef(null);
    
    // Define networks
    const NETWORKS = {
        ETHEREUM: 'ethereum',
        BSC: 'bsc',
        TRON: 'tron',
        ALGORAND: 'algorand'
    };

    // Network to currency mapping
    const networkCurrencyMap = {
        'ethereum': ['USDT', 'USDC', 'ETH'],
        'bsc': ['USDT', 'USDC', 'BNB'],
        'tron': ['USDT', 'USDC', 'TRX'],
        'algorand': ['USDT', 'USDC', 'ALGO']
    };
    
    // Customer information state
    const [customerInfo, setCustomerInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
        phone: ''
    });
    
    // Payment state
    const [paymentMethod, setPaymentMethod] = useState('coinley');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('pending');
    
    // Currency and network selection
    const [selectedCurrency, setSelectedCurrency] = useState('USDT');
    const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
    
    // Wallet address configuration
    const [walletAddresses, setWalletAddresses] = useState({});
    const [loadingWallets, setLoadingWallets] = useState(false);
    
    // Available currencies
    const availableCurrencies = ['USDT', 'USDC', 'ETH', 'BNB', 'TRX', 'ALGO'];
    
    // Calculate order totals
    const shippingCost = subtotal > 50 ? 0 : 0.001;
    const taxRate = 0.001;
    const tax = subtotal * taxRate;
    const total = subtotal + shippingCost + tax;
    
    // Load merchant wallet addresses on component mount
    useEffect(() => {
        if (paymentMethod === 'coinley') {
            loadMerchantWallets();
        }
    }, [paymentMethod]);
    
    // Load merchant wallet addresses from your backend or set them directly
    const loadMerchantWallets = async () => {
        try {
            setLoadingWallets(true);
            
            // Option 1: Load from your merchant API (if you have merchant authentication)
            // const response = await axios.get(`${URL}/api/merchants/wallets`, {
            //     headers: { Authorization: `Bearer ${yourMerchantToken}` }
            // });
            // setWalletAddresses(response.data.merchantWallets);
            
            // Option 2: Set them directly (for now, while testing)
            const merchantWallets = {
                ethereum: '0x581c333Ca62d04bADb563750535C935516b90839',
                bsc: '0x581c333Ca62d04bADb563750535C935516b90839',
                tron: 'TV3d7eKYnaV4NVbwrqEPoyib9yXbZUYEBJ',
                algorand: 'LVUECLJSQODSDJNYRXVKLHKMN7XA2M3PGPKYNACDRGSKCQISFN6IXTVPOA'
            };
            setWalletAddresses(merchantWallets);
            
            // Option 3: Load from environment variables
            // const merchantWallets = {
            //     ethereum: process.env.REACT_APP_ETH_WALLET,
            //     bsc: process.env.REACT_APP_BSC_WALLET,
            //     tron: process.env.REACT_APP_TRON_WALLET,
            //     algorand: process.env.REACT_APP_ALGO_WALLET
            // };
            // setWalletAddresses(merchantWallets);
            
        } catch (error) {
            console.error('Error loading merchant wallets:', error);
            setError('Failed to load payment configuration. Please try again.');
        } finally {
            setLoadingWallets(false);
        }
    };
    
    // Update network when currency changes
    const updateNetworkForCurrency = (currency) => {
        const supportedNetworks = Object.keys(networkCurrencyMap).filter(network => 
            networkCurrencyMap[network].includes(currency)
        );
        
        if (supportedNetworks.length > 0) {
            if (supportedNetworks.includes(selectedNetwork)) {
                return; // Keep current network
            }
            setSelectedNetwork(supportedNetworks[0]);
        }
    };
    
    // Handle currency change
    const handleCurrencyChange = (currency) => {
        setSelectedCurrency(currency);
        updateNetworkForCurrency(currency);
    };
    
    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Validate wallet address for selected network
    const validateWalletAddress = (address, network) => {
        if (!address) return false;
        
        switch (network) {
            case 'ethereum':
            case 'bsc':
                return /^0x[a-fA-F0-9]{40}$/.test(address);
            case 'tron':
                return /^T[a-zA-Z0-9]{33}$/.test(address);
            case 'algorand':
                return /^[A-Z2-7]{58}$/.test(address);
            default:
                return address.length > 10; // Basic validation
        }
    };
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);
        
        try {
            // Validate required fields
            const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode', 'phone'];
            const missingFields = requiredFields.filter(field => !customerInfo[field]);
            
            if (missingFields.length > 0) {
                throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(customerInfo.email)) {
                throw new Error('Please enter a valid email address');
            }
            
            // Validate wallet address for crypto payments
            if (paymentMethod === 'coinley') {
                const recipientAddress = walletAddresses[selectedNetwork];
                if (!recipientAddress) {
                    throw new Error(`No wallet address configured for ${selectedNetwork}. Please contact support.`);
                }
                
                if (!validateWalletAddress(recipientAddress, selectedNetwork)) {
                    throw new Error(`Invalid wallet address format for ${selectedNetwork}. Please contact support.`);
                }
            }
            
            // Create order object
            const order = {
                items: cartItems,
                customer: customerInfo,
                totals: {
                    subtotal,
                    shipping: shippingCost,
                    tax,
                    total
                },
                paymentMethod,
                paymentDetails: {
                    currency: selectedCurrency,
                    network: selectedNetwork,
                    recipientAddress: walletAddresses[selectedNetwork]
                }
            };
            
            // Create order in your backend
            const orderResponse = await axios.post(`${URL}/api/orders`, order);
            const orderId = orderResponse.data.id;
            
            setCurrentOrderId(orderId);
            localStorage.setItem('currentOrderId', orderId);
            
            // Initiate payment if crypto payment method is selected
            if (paymentMethod === 'coinley' && coinleyCheckoutRef.current) {
                initiatePayment(orderId);
            } else {
                setProcessing(false);
            }
        } catch (err) {
            console.error('Checkout error:', err);
            setError(err.response?.data?.error || err.message || 'There was a problem processing your order. Please try again.');
            setProcessing(false);
        }
    };
    
    // Initialize payment with Coinley
    const initiatePayment = (orderId) => {
        if (coinleyCheckoutRef.current) {
            const recipientAddress = walletAddresses[selectedNetwork];
            
            console.log('Initiating payment with:', {
                network: selectedNetwork,
                currency: selectedCurrency,
                amount: total,
                recipientAddress,
                allWalletAddresses: walletAddresses
            });
            
            // Validate recipient address
            if (!recipientAddress) {
                setError(`No wallet address configured for ${selectedNetwork}. Please contact support.`);
                setProcessing(false);
                return;
            }
            
            if (!validateWalletAddress(recipientAddress, selectedNetwork)) {
                setError(`Invalid wallet address format for ${selectedNetwork}. Please contact support.`);
                setProcessing(false);
                return;
            }
            
            // Create payment configuration object
            const paymentConfig = {
                amount: total,
                currency: selectedCurrency,
                network: selectedNetwork,
                customerEmail: customerInfo.email,
                callbackUrl: `${window.location.origin}/api/webhooks/payments/coinley`,
                
                // Multiple ways to pass the recipient address to ensure compatibility
                recipientAddress: recipientAddress,
                toAddress: recipientAddress,
                walletAddress: recipientAddress,
                
                // Pass all wallet addresses for network switching
                merchantWalletAddresses: walletAddresses,
                
                // Additional configuration
                debug: true,
                testMode: false,
                metadata: {
                    orderId: orderId,
                    customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
                    recipientAddress: recipientAddress,
                    network: selectedNetwork,
                    walletAddresses: walletAddresses
                }
            };
            
            console.log('Payment configuration:', paymentConfig);
            
            try {
                // Open the payment modal
                coinleyCheckoutRef.current.open(paymentConfig);
            } catch (error) {
                console.error("Error opening Coinley checkout:", error);
                setError(`Payment initialization failed: ${error.message}`);
                setProcessing(false);
            }
        } else {
            console.error("Coinley checkout ref is not available");
            setError("Payment gateway initialization failed. Please try again.");
            setProcessing(false);
        }
    };
    
    // Handle successful payment
    const handlePaymentSuccess = async (paymentId, transactionHash, paymentDetails) => {
        try {
            console.log('Payment success:', { paymentId, transactionHash, paymentDetails });
            setPaymentStatus('success');
            
            const orderId = currentOrderId || localStorage.getItem('currentOrderId');
            if (!orderId) {
                throw new Error('Order ID is missing. Please contact support with your transaction hash.');
            }
            
            // Update order with payment details
            await axios.put(`${URL}/api/orders/${orderId}`, {
                paymentStatus: 'paid',
                paymentDetails: {
                    paymentId,
                    status: 'success',
                    transactionId: transactionHash,
                    network: paymentDetails?.network || selectedNetwork,
                    currency: paymentDetails?.currency || selectedCurrency,
                    amount: paymentDetails?.amount || total,
                    recipientAddress: walletAddresses[selectedNetwork],
                    timestamp: new Date().toISOString()
                }
            });
            
            // Clear the cart
            clearCart();
            
            // Redirect to success page
            navigate('/order-success', {
                state: {
                    orderId,
                    total,
                    paymentDetails: {
                        transactionId: transactionHash,
                        paymentId,
                        network: paymentDetails?.network || selectedNetwork,
                        currency: paymentDetails?.currency || selectedCurrency,
                        recipientAddress: walletAddresses[selectedNetwork]
                    }
                }
            });
        } catch (err) {
            console.error('Payment update error:', err);
            setError('Payment was received, but we had trouble updating your order. Please contact support with your transaction ID: ' + transactionHash);
        } finally {
            setProcessing(false);
        }
    };
    
    // Handle payment error
    const handlePaymentError = (error) => {
        console.error('Payment error:', error);
        setPaymentStatus('failed');
        
        // Log debugging information
        console.log('Payment error debugging info:', {
            selectedNetwork,
            selectedCurrency,
            walletAddresses,
            recipientAddress: walletAddresses[selectedNetwork],
            errorMessage: error.message
        });
        
        if (error.message && error.message.includes('User rejected')) {
            setError('Payment was rejected. You can try again when ready.');
        } else if (error.message && error.message.includes('insufficient funds')) {
            setError('Payment failed: Insufficient funds in your wallet. Please add funds and try again.');
        } else if (error.message && error.message.includes('Recipient address not provided')) {
            setError(`Payment failed: No recipient address configured for ${selectedNetwork}. Please contact support.`);
        } else {
            setError(`Payment failed: ${error.message || 'Unknown error occurred'}`);
        }
        
        setProcessing(false);
    };
    
    // Handle closing the payment modal
    const handleCloseModal = () => {
        console.log('Payment modal closed');
        setProcessing(false);
    };
    
    // Get the current recipient address
    const getCurrentRecipientAddress = () => {
        return walletAddresses[selectedNetwork] || 'Not configured';
    };
    
    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Checkout Form */}
                <div>
                    <form onSubmit={handleSubmit}>
                        {/* Shipping Information */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name*
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={customerInfo.firstName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                                    />
                                </div>

                                <div className="col-span-1">
                                     <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                       Last Name*
                                   </label>
                                   <input
                                       type="text"
                                       id="lastName"
                                       name="lastName"
                                       value={customerInfo.lastName}
                                       onChange={handleInputChange}
                                       required
                                       className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                                   />
                               </div>

                                <div className="col-span-2">
                                   <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                       Email Address*
                                   </label>
                                   <input
                                       type="email"
                                       id="email"
                                       name="email"
                                       value={customerInfo.email}
                                       onChange={handleInputChange}
                                       required
                                       className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                                   />
                               </div>

                                <div className="col-span-2">
                                   <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                       Address*
                                   </label>
                                   <input
                                       type="text"
                                       id="address"
                                       name="address"
                                       value={customerInfo.address}
                                       onChange={handleInputChange}
                                       required
                                       className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                                   />
                               </div>

                                <div className="col-span-1">
                                   <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                       City*
                                   </label>
                                   <input
                                       type="text"
                                       id="city"
                                       name="city"
                                       value={customerInfo.city}
                                       onChange={handleInputChange}
                                       required
                                       className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                                   />
                               </div>

                                <div className="col-span-1">
                                   <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                       State/Province*
                                   </label>
                                   <input
                                       type="text"
                                       id="state"
                                       name="state"
                                       value={customerInfo.state}
                                       onChange={handleInputChange}
                                       required
                                       className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                                   />
                               </div>

                                <div className="col-span-1">
                                   <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                                       ZIP/Postal Code*
                                   </label>
                                   <input
                                       type="text"
                                       id="zipCode"
                                       name="zipCode"
                                       value={customerInfo.zipCode}
                                       onChange={handleInputChange}
                                       required
                                       className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                                   />
                               </div>

                                <div className="col-span-1">
                                   <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                       Country*
                                   </label>
                                   <select
                                       id="country"
                                       name="country"
                                       value={customerInfo.country}
                                       onChange={handleInputChange}
                                       required
                                       className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                                   >
                                       <option value="US">United States</option>
                                       <option value="CA">Canada</option>
                                       <option value="UK">United Kingdom</option>
                                       <option value="AU">Australia</option>
                                       <option value="NG">Nigeria</option>
                                       <option value="GH">Ghana</option>
                                       <option value="KE">Kenya</option>
                                       <option value="ZA">South Africa</option>
                                   </select>
                               </div>

                                <div className="col-span-2">
                                   <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                       Phone Number*
                                   </label>
                                   <input
                                       type="tel"
                                       id="phone"
                                       name="phone"
                                       value={customerInfo.phone}
                                       onChange={handleInputChange}
                                       required
                                       className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7042D2]"
                                     />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        id="coinley"
                                        name="paymentMethod"
                                        type="radio"
                                        checked={paymentMethod === 'coinley'}
                                        onChange={() => setPaymentMethod('coinley')}
                                        className="h-4 w-4 text-blue-600 focus:ring-[#7042D2] border-gray-300"
                                    />
                                    <label htmlFor="coinley" className="ml-3 block text-sm font-medium text-gray-700">
                                        Pay with Cryptocurrency
                                    </label>
                                </div>

                                {paymentMethod === 'coinley' && (
                                    <div className="ml-7 mt-2 bg-blue-50 p-4 rounded-md">
                                        {loadingWallets ? (
                                            <div className="text-center py-2">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                                                <p className="text-sm text-blue-600 mt-2">Loading payment configuration...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="mb-3">
                                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                                        Select Currency
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {availableCurrencies.map(currency => (
                                                            <button
                                                                key={currency}
                                                                type="button"
                                                                onClick={() => handleCurrencyChange(currency)}
                                                                className={`px-3 py-1 rounded-md text-sm ${
                                                                    selectedCurrency === currency 
                                                                        ? 'bg-blue-600 text-white' 
                                                                        : 'bg-white text-blue-600 border border-blue-300'
                                                                }`}
                                                            >
                                                                {currency}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                
                                                <div className="mb-3">
                                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                                        Preferred Network
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {Object.keys(NETWORKS).map(networkKey => {
                                                            const network = NETWORKS[networkKey].toLowerCase();
                                                            // Only show networks that support the selected currency
                                                            if (!networkCurrencyMap[network]?.includes(selectedCurrency)) {
                                                                return null;
                                                            }
                                                            return (
                                                                <button
                                                                    key={network}
                                                                    type="button"
                                                                    onClick={() => setSelectedNetwork(network)}
                                                                    className={`px-3 py-1 rounded-md text-sm ${
                                                                        selectedNetwork === network 
                                                                            ? 'bg-blue-600 text-white' 
                                                                            : 'bg-white text-blue-600 border border-blue-300'
                                                                    }`}
                                                                >
                                                                    {networkKey}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                
                                                {/* Payment Configuration Display */}
                                                <div className="mt-4 p-3 bg-white rounded border">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Configuration</h4>
                                                    <div className="space-y-1 text-xs">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Network:</span>
                                                            <span className="font-medium">{selectedNetwork.toUpperCase()}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Currency:</span>
                                                            <span className="font-medium">{selectedCurrency}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Recipient:</span>
                                                            <span className="font-mono text-xs break-all">
                                                                {getCurrentRecipientAddress()}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Status:</span>
                                                            <span className={`font-medium ${
                                                                walletAddresses[selectedNetwork] 
                                                                    ? 'text-green-600' 
                                                                    : 'text-red-600'
                                                            }`}>
                                                                {walletAddresses[selectedNetwork] ? 'Ready' : 'Not Configured'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <p className="text-sm text-blue-700 mt-2">
                                                    You'll be able to pay using MetaMask, TronLink, Trust Wallet, or Lute Wallet depending on your selected network.
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Order */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                                    {error}
                                </div>
                            )}
                            
                            {paymentStatus === 'success' && (
                                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
                                    Payment successful! Redirecting to order confirmation...
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-[#7042D2] hover:bg-[#8152E2] text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7042D2] disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={processing || paymentStatus === 'success' || (paymentMethod === 'coinley' && !walletAddresses[selectedNetwork])}
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : paymentMethod === 'coinley' && !walletAddresses[selectedNetwork] ? (
                                    'Payment Configuration Required'
                                ) : (
                                    'Place Order'
                                )}
                            </button>
                            
                            {paymentMethod === 'coinley' && !walletAddresses[selectedNetwork] && (
                                <p className="text-sm text-red-600 mt-2 text-center">
                                    No wallet address configured for {selectedNetwork}. Please contact support.
                                </p>
                            )}
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div>
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                        <div className="max-h-80 overflow-y-auto mb-4">
                            <ul className="divide-y divide-gray-200">
                                {cartItems.map((item) => (
                                    <li key={item.id} className="py-3 flex items-center">
                                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                                             {item.imageUrl ? (
                                                 <img 
                                                     src={item.imageUrl} 
                                                     alt={item.name} 
                                                     className="w-full h-full object-cover"
                                                 />
                                             ) : (
                                                 <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                     <span className="text-gray-400">{item.name[0]}</span>
                                                 </div>
                                             )}
                                         </div>
                                         <div className="ml-3 flex-1">
                                             <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                             <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                         </div>
                                         <p className="text-sm font-medium text-gray-900">
                                             ${(item.price * item.quantity).toFixed(2)}
                                         </p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-3 border-t pt-3">
                            <div className="flex justify-between">
                                <p className="text-sm text-gray-600">Subtotal</p>
                                <p className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</p>
                            </div>

                            <div className="flex justify-between">
                                <p className="text-sm text-gray-600">Shipping</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {shippingCost === 0
                                        ? <span className="text-green-600">Free</span>
                                        : `${shippingCost.toFixed(2)}`
                                    }
                                </p>
                            </div>

                            <div className="flex justify-between">
                                <p className="text-sm text-gray-600">Tax (0.1%)</p>
                                <p className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</p>
                            </div>

                            <div className="flex justify-between border-t pt-3">
                                <p className="text-base font-medium text-gray-900">Total</p>
                                <div className="text-right">
                                    <p className="text-base font-bold text-blue-600">${total.toFixed(2)}</p>
                                    {selectedCurrency && selectedCurrency !== 'USD' && walletAddresses[selectedNetwork] && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            <p>Pay with: {selectedCurrency} on {selectedNetwork}</p>
                                            <p className="font-mono break-all">
                                                To: {walletAddresses[selectedNetwork].slice(0, 10)}...
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coinley Checkout Component */}
            <ThemeProvider initialTheme="light">
                <CoinleyProvider
                    apiKey="afb78ff958350b9067798dd077c28459"
                    apiSecret="c22d3879eff18c2d3f8f8a61d4097c230a940356a3d139ffceee11ba65b1a34c"
                    apiUrl="https://coinleyserver-production.up.railway.app"
                    debug={true}
                >
                    <CoinleyCheckout
                        ref={coinleyCheckoutRef}
                        customerEmail={customerInfo.email || ''}
                        merchantName="FreshBites"
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        onClose={handleCloseModal}
                        theme="light"
                        autoOpen={false}
                        testMode={false}
                        supportedNetworks={Object.values(NETWORKS)}
                        supportedCurrencies={availableCurrencies}
                        defaultCurrency={selectedCurrency}
                        defaultNetwork={selectedNetwork}
                    />
                </CoinleyProvider>
            </ThemeProvider>
        </div>
    );
}

export default CheckoutPage;