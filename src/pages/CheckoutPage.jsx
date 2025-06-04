// // CheckoutPage.jsx - COMPLETELY FIXED VERSION
// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import axios from 'axios';
// import { URL } from '../url';

// // Import the SDK components
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
//     const [paymentStatus, setPaymentStatus] = useState('pending');
    
//     // Select currency options
//     const [selectedCurrency, setSelectedCurrency] = useState('USDT');
//     const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
    
//     // Available currencies and networks
//     const availableCurrencies = ['USDT', 'USDC', 'ETH', 'BNB', 'TRX', 'ALGO'];
//     const availableNetworks = ['ethereum', 'bsc', 'tron', 'algorand'];
    
//     // Network to currency mapping
//     const networkCurrencyMap = {
//         'ethereum': ['USDT', 'USDC', 'ETH'],
//         'bsc': ['USDT', 'USDC', 'BNB'],
//         'tron': ['USDT', 'USDC', 'TRX'],
//         'algorand': ['USDT', 'USDC', 'ALGO']
//     };
    
//     // Calculate order totals
//     const shippingCost = subtotal > 50 ? 0 : 0.1;
//     const taxRate = 0.08;
//     const tax = subtotal * taxRate;
//     const total = subtotal + shippingCost + tax;
    
//     // Update network when currency changes
//     const updateNetworkForCurrency = (currency) => {
//         const supportedNetworks = Object.keys(networkCurrencyMap).filter(network => 
//             networkCurrencyMap[network].includes(currency)
//         );
        
//         if (supportedNetworks.length > 0) {
//             if (supportedNetworks.includes(selectedNetwork)) {
//                 return; // Keep current network
//             }
//             setSelectedNetwork(supportedNetworks[0]);
//         }
//     };
    
//     // Handle currency change
//     const handleCurrencyChange = (currency) => {
//         setSelectedCurrency(currency);
//         updateNetworkForCurrency(currency);
//     };
    
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
//             // Validate required fields
//             const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode', 'phone'];
//             const missingFields = requiredFields.filter(field => !customerInfo[field]);
            
//             if (missingFields.length > 0) {
//                 throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
//             }
            
//             // Validate email format
//             const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//             if (!emailRegex.test(customerInfo.email)) {
//                 throw new Error('Please enter a valid email address');
//             }
            
//             // Create order object
//             const order = {
//                 items: cartItems,
//                 customer: customerInfo,
//                 totals: {
//                     subtotal,
//                     shipping: shippingCost,
//                     tax,
//                     total
//                 },
//                 paymentMethod,
//                 paymentDetails: {
//                     currency: selectedCurrency,
//                     network: selectedNetwork
//                 }
//             };
            
//             // Create order in your system
//             const orderResponse = await axios.post(`${URL}/api/orders`, order);
//             const orderId = orderResponse.data.id;
            
//             setCurrentOrderId(orderId);
//             localStorage.setItem('currentOrderId', orderId);
            
//             // Initiate crypto payment
//             if (paymentMethod === 'coinley' && coinleyCheckoutRef.current) {
//                 initiatePayment(orderId);
//             } else {
//                 setProcessing(false);
//             }
//         } catch (err) {
//             console.error('Checkout error:', err);
//             setError(err.response?.data?.error || err.message || 'There was a problem processing your order. Please try again.');
//             setProcessing(false);
//         }
//     };
    
//     // Initialize payment with Coinley
//     const initiatePayment = (orderId) => {
//         if (coinleyCheckoutRef.current) {
//             console.log('Initiating payment with Coinley...');
            
//             const paymentConfig = {
//                 amount: total,
//                 currency: selectedCurrency,
//                 network: selectedNetwork,
//                 customerEmail: customerInfo.email,
//                 callbackUrl: `${window.location.origin}/api/webhooks/payments/coinley`,
//                 metadata: {
//                     orderId: orderId,
//                     customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
//                     selectedNetwork: selectedNetwork,
//                     selectedCurrency: selectedCurrency
//                 }
//             };
            
//             console.log('Payment configuration:', paymentConfig);
            
//             try {
//                 coinleyCheckoutRef.current.open(paymentConfig);
//             } catch (error) {
//                 console.error("Error opening Coinley checkout:", error);
//                 setError(`Payment initialization failed: ${error.message}`);
//                 setProcessing(false);
//             }
//         } else {
//             console.error("Coinley checkout ref is not available");
//             setError("Payment gateway initialization failed. Please try again.");
//             setProcessing(false);
//         }
//     };
    
//     // Handle successful payment
//     const handlePaymentSuccess = async (paymentId, transactionHash, paymentDetails) => {
//         try {
//             console.log('Payment success:', { paymentId, transactionHash, paymentDetails });
//             setPaymentStatus('success');
            
//             const orderId = currentOrderId || localStorage.getItem('currentOrderId');
//             if (!orderId) {
//                 throw new Error('Order ID is missing. Please contact support with your transaction hash.');
//             }
            
//             // Update order with payment details
//             await axios.put(`${URL}/api/orders/${orderId}`, {
//                 paymentStatus: 'paid',
//                 paymentDetails: {
//                     paymentId,
//                     status: 'success',
//                     transactionId: transactionHash,
//                     network: paymentDetails?.network || selectedNetwork,
//                     currency: paymentDetails?.currency || selectedCurrency,
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
//                         network: paymentDetails?.network || selectedNetwork,
//                         currency: paymentDetails?.currency || selectedCurrency
//                     }
//                 }
//             });
//         } catch (err) {
//             console.error('Payment update error:', err);
//             setError('Payment was received, but we had trouble updating your order. Please contact support with your transaction ID: ' + transactionHash);
//         } finally {
//             setProcessing(false);
//         }
//     };
    
//     // Handle payment error
//     const handlePaymentError = (error) => {
//         console.error('Payment error:', error);
//         setPaymentStatus('failed');
        
//         const errorMessage = error.message || 'Unknown error';
//         console.log('Error details:', error);
        
//         if (errorMessage.includes('User rejected')) {
//             setError('Payment was rejected. You can try again when ready.');
//         } else if (errorMessage.includes('insufficient funds')) {
//             setError('Payment failed: Insufficient funds in your wallet. Please add funds and try again.');
//         } else {
//             setError(`Payment failed: ${errorMessage}`);
//         }
        
//         setProcessing(false);
//     };
    
//     // Handle closing the payment modal
//     const handleCloseModal = () => {
//         console.log('Payment modal closed');
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
//                                        <option value="NG">Nigeria</option>
//                                        <option value="GH">Ghana</option>
//                                        <option value="KE">Kenya</option>
//                                        <option value="ZA">South Africa</option>
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
//                                     <div className="ml-7 mt-2 bg-blue-50 p-4 rounded-md">
//                                         <div className="mb-3">
//                                             <label className="block text-sm font-medium text-blue-700 mb-1">
//                                                 Select Currency
//                                             </label>
//                                             <div className="flex flex-wrap gap-2">
//                                                 {availableCurrencies.map(currency => (
//                                                     <button
//                                                         key={currency}
//                                                         type="button"
//                                                         onClick={() => handleCurrencyChange(currency)}
//                                                         className={`px-3 py-1 rounded-md text-sm ${
//                                                             selectedCurrency === currency 
//                                                                 ? 'bg-blue-600 text-white' 
//                                                                 : 'bg-white text-blue-600 border border-blue-300'
//                                                         }`}
//                                                     >
//                                                         {currency}
//                                                     </button>
//                                                 ))}
//                                             </div>
//                                         </div>
                                        
//                                         <div className="mb-3">
//                                             <label className="block text-sm font-medium text-blue-700 mb-1">
//                                                 Preferred Network
//                                             </label>
//                                             <div className="flex flex-wrap gap-2">
//                                                 {availableNetworks.map(network => {
//                                                     // Only show networks that support the selected currency
//                                                     if (!networkCurrencyMap[network]?.includes(selectedCurrency)) {
//                                                         return null;
//                                                     }
//                                                     return (
//                                                         <button
//                                                             key={network}
//                                                             type="button"
//                                                             onClick={() => setSelectedNetwork(network)}
//                                                             className={`px-3 py-1 rounded-md text-sm capitalize ${
//                                                                 selectedNetwork === network 
//                                                                     ? 'bg-blue-600 text-white' 
//                                                                     : 'bg-white text-blue-600 border border-blue-300'
//                                                             }`}
//                                                         >
//                                                             {network}
//                                                         </button>
//                                                     );
//                                                 })}
//                                             </div>
//                                         </div>
                                        
//                                         <p className="text-sm text-blue-700 mt-2">
//                                             You'll be able to pay using MetaMask, TronLink, Trust Wallet, or Lute Wallet depending on your selected network.
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
                            
//                             {paymentStatus === 'success' && (
//                                 <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
//                                     Payment successful! Redirecting to order confirmation...
//                                 </div>
//                             )}

//                             <button
//                                 type="submit"
//                                 className="w-full py-2 px-4 bg-[#7042D2] hover:bg-[#8152E2] text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7042D2]"
//                                 disabled={processing || paymentStatus === 'success'}
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
//                                 <div className="text-right">
//                                     <p className="text-base font-bold text-blue-600">${total.toFixed(2)}</p>
//                                     {selectedCurrency && selectedCurrency !== 'USD' && (
//                                         <p className="text-xs text-gray-500 mt-1">
//                                             Pay with: {selectedCurrency} on {selectedNetwork}
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Coinley Payment Gateway */}
//             <ThemeProvider initialTheme="light">
//                 <CoinleyProvider
//                     apiKey="afb78ff958350b9067798dd077c28459"
//                     apiSecret="c22d3879eff18c2d3f8f8a61d4097c230a940356a3d139ffceee11ba65b1a34c"
//                     apiUrl="https://coinleyserver-production.up.railway.app"
//                     debug={true}
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
//                         supportedNetworks={availableNetworks}
//                         supportedCurrencies={availableCurrencies}
//                         defaultCurrency={selectedCurrency}
//                         defaultNetwork={selectedNetwork}
//                         debug={true}
//                     />
//                 </CoinleyProvider>
//             </ThemeProvider>
//         </div>
//     );
// }

// export default CheckoutPage;












// // CheckoutPage.jsx 
// import { useState,  useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import axios from 'axios';
// import { URL } from '../url';

// // Import the SDK components
// import { 
//   ThemeProvider, 
//   CoinleyProvider, 
//   CoinleyCheckout,
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
//     const [paymentStatus, setPaymentStatus] = useState('pending');
    
//     // Calculate order totals
//     const shippingCost = subtotal > 50 ? 0 : 0.01;
//     const total = subtotal + shippingCost;
    
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
//             // Validate required fields
//             const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode', 'phone'];
//             const missingFields = requiredFields.filter(field => !customerInfo[field]);
            
//             if (missingFields.length > 0) {
//                 throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
//             }
            
//             // Validate email format
//             const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//             if (!emailRegex.test(customerInfo.email)) {
//                 throw new Error('Please enter a valid email address');
//             }
            
//             // Create order object
//             const order = {
//                 items: cartItems,
//                 customer: customerInfo,
//                 totals: {
//                     subtotal,
//                     shipping: shippingCost,
//                     total
//                 },
//                 paymentMethod
//             };
            
//             // Create order in your system
//             const orderResponse = await axios.post(`${URL}/api/orders`, order);
//             const orderId = orderResponse.data.id;
            
//             setCurrentOrderId(orderId);
//             localStorage.setItem('currentOrderId', orderId);
            
//             // Initiate crypto payment
//             if (paymentMethod === 'coinley' && coinleyCheckoutRef.current) {
//                 initiatePayment(orderId);
//             } else {
//                 setProcessing(false);
//             }
//         } catch (err) {
//             console.error('Checkout error:', err);
//             setError(err.response?.data?.error || err.message || 'There was a problem processing your order. Please try again.');
//             setProcessing(false);
//         }
//     };
    
//     // Initialize payment with Coinley
//     const initiatePayment = (orderId) => {
//         if (coinleyCheckoutRef.current) {
//             console.log('Initiating payment with Coinley...');
            
//             const paymentConfig = {
//                 amount: total,
//                 currency: 'USDT', // Default currency - user can select in the SDK
//                 network: 'ethereum', // Default network - user can select in the SDK
//                 customerEmail: customerInfo.email,
//                 callbackUrl: `${window.location.origin}/api/webhooks/payments/coinley`,
//                 metadata: {
//                     orderId: orderId,
//                     customerName: `${customerInfo.firstName} ${customerInfo.lastName}`
//                 }
//             };
            
//             console.log('Payment configuration:', paymentConfig);
            
//             try {
//                 coinleyCheckoutRef.current.open(paymentConfig);
//             } catch (error) {
//                 console.error("Error opening Coinley checkout:", error);
//                 setError(`Payment initialization failed: ${error.message}`);
//                 setProcessing(false);
//             }
//         } else {
//             console.error("Coinley checkout ref is not available");
//             setError("Payment gateway initialization failed. Please try again.");
//             setProcessing(false);
//         }
//     };
    
//     // Handle successful payment
//     const handlePaymentSuccess = async (paymentId, transactionHash, paymentDetails) => {
//         try {
//             console.log('Payment success:', { paymentId, transactionHash, paymentDetails });
//             setPaymentStatus('success');
            
//             const orderId = currentOrderId || localStorage.getItem('currentOrderId');
//             if (!orderId) {
//                 throw new Error('Order ID is missing. Please contact support with your transaction hash.');
//             }
            
//             // Update order with payment details
//             await axios.put(`${URL}/api/orders/${orderId}`, {
//                 paymentStatus: 'paid',
//                 paymentDetails: {
//                     paymentId,
//                     status: 'success',
//                     transactionId: transactionHash,
//                     network: paymentDetails?.network,
//                     currency: paymentDetails?.currency,
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
//             setError('Payment was received, but we had trouble updating your order. Please contact support with your transaction ID: ' + transactionHash);
//         } finally {
//             setProcessing(false);
//         }
//     };
    
//     // Handle payment error
//     const handlePaymentError = (error) => {
//         console.error('Payment error:', error);
//         setPaymentStatus('failed');
        
//         const errorMessage = error.message || 'Unknown error';
//         console.log('Error details:', error);
        
//         if (errorMessage.includes('User rejected')) {
//             setError('Payment was rejected. You can try again when ready.');
//         } else if (errorMessage.includes('insufficient funds')) {
//             setError('Payment failed: Insufficient funds in your wallet. Please add funds and try again.');
//         } else {
//             setError(`Payment failed: ${errorMessage}`);
//         }
        
//         setProcessing(false);
//     };
    
//     // Handle closing the payment modal
//     const handleCloseModal = () => {
//         console.log('Payment modal closed');
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
//                                        <option value="NG">Nigeria</option>
//                                        <option value="GH">Ghana</option>
//                                        <option value="KE">Kenya</option>
//                                        <option value="ZA">South Africa</option>
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
//                             {/* <h2 className="text-xl font-semibold mb-4">Payment Method</h2> */}

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

                            
//                             </div>
//                         </div>

//                         {/* Submit Order */}
//                         <div className="bg-white rounded-lg shadow-md p-6">
//                             {error && (
//                                 <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
//                                     {error}
//                                 </div>
//                             )}
                            
//                             {paymentStatus === 'success' && (
//                                 <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
//                                     Payment successful! Redirecting to order confirmation...
//                                 </div>
//                             )}

//                             <button
//                                 type="submit"
//                                 className="w-full py-2 px-4 bg-[#7042D2] hover:bg-[#8152E2] text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7042D2]"
//                                 disabled={processing || paymentStatus === 'success'}
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

//                             <div className="flex justify-between border-t pt-3">
//                                 <p className="text-base font-medium text-gray-900">Total</p>
//                                 <div className="text-right">
//                                     <p className="text-base font-bold text-blue-600">${total.toFixed(2)}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Coinley Payment Gateway */}
//             <ThemeProvider initialTheme="light">
//                 <CoinleyProvider
//                     apiKey="afb78ff958350b9067798dd077c28459"
//                     apiSecret="c22d3879eff18c2d3f8f8a61d4097c230a940356a3d139ffceee11ba65b1a34c"
//                     apiUrl="https://coinleyserver-production.up.railway.app"
//                     debug={true}
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
//                         debug={true}
//                     />
//                 </CoinleyProvider>
//             </ThemeProvider>
//         </div>
//     );
// }

// export default CheckoutPage;






// CheckoutPage.jsx 
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { URL } from '../url';

// Import the SDK components
import { 
  ThemeProvider, 
  CoinleyProvider, 
  CoinleyCheckout,
} from 'coinley-checkout';

function CheckoutPage() {
    const navigate = useNavigate();
    const { cartItems, subtotal, clearCart } = useCart();
    const coinleyCheckoutRef = useRef(null);
    
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
    
    // Add state to store payment success data
    const [successData, setSuccessData] = useState(null);
    
    // Calculate order totals
    const shippingCost = subtotal > 50 ? 0 : 0.01;
    const total = subtotal + shippingCost;
    
    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({
            ...prev,
            [name]: value
        }));
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
            
            // Create order object
            const order = {
                items: cartItems,
                customer: customerInfo,
                totals: {
                    subtotal,
                    shipping: shippingCost,
                    total
                },
                paymentMethod
            };
            
            // Create order in your system
            const orderResponse = await axios.post(`${URL}/api/orders`, order);
            const orderId = orderResponse.data.id;
            
            setCurrentOrderId(orderId);
            localStorage.setItem('currentOrderId', orderId);
            
            // Initiate crypto payment
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
            console.log('Initiating payment with Coinley...');
            
            const paymentConfig = {
                amount: total,
                currency: 'USDT', // Default currency - user can select in the SDK
                network: 'ethereum', // Default network - user can select in the SDK
                customerEmail: customerInfo.email,
                callbackUrl: `${window.location.origin}/api/webhooks/payments/coinley`,
                metadata: {
                    orderId: orderId,
                    customerName: `${customerInfo.firstName} ${customerInfo.lastName}`
                }
            };
            
            console.log('Payment configuration:', paymentConfig);
            
            try {
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
    
    // Handle successful payment - Updated to store success data but not navigate immediately
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
                    network: paymentDetails?.network,
                    currency: paymentDetails?.currency,
                    amount: paymentDetails?.amount || total,
                    timestamp: new Date().toISOString()
                }
            });
            
            // Clear the cart
            clearCart();
            
            // Store success data instead of immediately navigating
            setSuccessData({
                orderId,
                total,
                paymentDetails: {
                    transactionId: transactionHash,
                    paymentId,
                    network: paymentDetails?.network,
                    currency: paymentDetails?.currency
                }
            });
            
            // Don't navigate here - wait for modal close
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
        
        const errorMessage = error.message || 'Unknown error';
        console.log('Error details:', error);
        
        if (errorMessage.includes('User rejected')) {
            setError('Payment was rejected. You can try again when ready.');
        } else if (errorMessage.includes('insufficient funds')) {
            setError('Payment failed: Insufficient funds in your wallet. Please add funds and try again.');
        } else {
            setError(`Payment failed: ${errorMessage}`);
        }
        
        setProcessing(false);
    };
    
    // Handle closing the payment modal - Updated to navigate to success page if payment was successful
    const handleCloseModal = () => {
        console.log('Payment modal closed');
        setProcessing(false);
        
        // Navigate to success page only after modal is closed AND payment was successful
        if (successData) {
            navigate('/order-success', { state: successData });
        }
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
                            {/* <h2 className="text-xl font-semibold mb-4">Payment Method</h2> */}

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
                                    Payment successful! Please click the close button on the payment screen to continue.
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-[#7042D2] hover:bg-[#8152E2] text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7042D2]"
                                disabled={processing || paymentStatus === 'success'}
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    'Place Order'
                                )}
                            </button>
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
                                        : `$${shippingCost.toFixed(2)}`
                                    }
                                </p>
                            </div>

                            <div className="flex justify-between border-t pt-3">
                                <p className="text-base font-medium text-gray-900">Total</p>
                                <div className="text-right">
                                    <p className="text-base font-bold text-blue-600">${total.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coinley Payment Gateway */}
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
                        debug={true}
                    />
                </CoinleyProvider>
            </ThemeProvider>
        </div>
    );
}

export default CheckoutPage;