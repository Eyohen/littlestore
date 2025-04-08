// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import axios from 'axios';
// import { URL } from '../url';
// import { ThemeProvider, CoinleyProvider, CoinleyModal, CoinleyCheckout } from 'coinley-sdk';




// function CheckoutPage() {
//     const navigate = useNavigate();
//     const { cartItems, subtotal, clearCart } = useCart();

//     // Shipping information state
//     const [shippingInfo, setShippingInfo] = useState({
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
//     const [showModal, setShowModal] = useState(false);
//     const [currentOrderId, setCurrentOrderId] = useState(null);

//     // Calculate order totals
//     const shippingCost = subtotal > 50 ? 0 : 0.02;
//     const taxRate = 0.002;
//     const tax = subtotal * taxRate;
//     const total = subtotal + shippingCost + tax;

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setShippingInfo(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };


//     const coinleyCheckoutRef = useRef(null);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setProcessing(true);
//         setError(null);

//         try {
//             // Create order object
//             const order = {
//                 items: cartItems,
//                 customer: shippingInfo,
//                 totals: {
//                     subtotal,
//                     shipping: shippingCost,
//                     tax,
//                     total
//                 },
//                 paymentMethod
//             };

//             // First, submit order to backend
//             const orderResponse = await axios.post(`${URL}/api/orders`, order);
//             const orderId = orderResponse.data.id;

//             // Store the order ID for reference
//             localStorage.setItem('currentOrderId', orderId);
//             setCurrentOrderId(orderId);

//             // Open Coinley modal for payment
//             if (paymentMethod === 'coinley') {
//                 setShowModal(true);
//             }
//         } catch (err) {
//             console.error('Checkout error:', err);
//             setError('There was a problem processing your order. Please try again.');
//             setProcessing(false);
//         }
//     };


//  // When the order is created successfully and you want to show the payment modal
//  const initiatePayment = () => {
//     if (coinleyCheckoutRef.current && currentOrderId) {
//       // Open the checkout with the correct parameters
//       coinleyCheckoutRef.current.open({
//         amount: total, // Your order total
//         currency: 'USDT', // Or whichever currency you want to use
//         customerEmail: shippingInfo.email,
//         metadata: {
//           orderId: currentOrderId
//         }
//       });
//     }
//   };
  
//   // Call initiatePayment when the order is created and showModal becomes true
//   useEffect(() => {
//     if (showModal && currentOrderId) {
//       initiatePayment();
//     }
//   }, [showModal, currentOrderId]);


//   // Inside your CheckoutPage component, add this useEffect:
// useEffect(() => {
//     // Log when the modal is shown
//     if (showModal) {
//       console.log("Modal shown, props:", {
//         customerEmail: shippingInfo.email || '',
//         merchantName: "Your E-Commerce Store",
//       });
      
//       // Log available SDK components
//       console.log("SDK Components:", {
//         ThemeProvider,
//         CoinleyProvider,
//         CoinleyModal
//       });
//     }
//   }, [showModal, shippingInfo.email]);



//     // Handle successful payment
//     const handlePaymentSuccess = async (transactionHash) => {
//         try {
//             const orderId = localStorage.getItem('currentOrderId') || currentOrderId;

//             // Update order with payment info
//             await axios.put(`${URL}/api/orders/${orderId}`, {
//                 paymentStatus: 'paid',
//                 paymentDetails: {
//                     status: 'success',
//                     transactionId: transactionHash,
//                     timestamp: new Date().toISOString()
//                 }
//             });

//             // Clear cart and redirect to success page
//             clearCart();
//             navigate('/order-success', {
//                 state: {
//                     orderId,
//                     total,
//                     paymentDetails: {
//                         transactionId: transactionHash
//                     }
//                 }
//             });
//         } catch (err) {
//             console.error('Payment update error:', err);
//             setError('Payment was received, but we had trouble updating your order. Please contact support.');
//         } finally {
//             setProcessing(false);
//             setShowModal(false);
//         }
//     };

//     // Handle closing the payment modal
//     const handleCloseModal = () => {
//         setShowModal(false);
//         setProcessing(false);
//     };

//     if (cartItems.length === 0) {
//         navigate('/cart');
//         return null;
//     }

//     return (
//         <div className="container-custom py-8">
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
//                                         value={shippingInfo.firstName}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                                     />
//                                 </div>

//                                 <div className="col-span-1">
//                                     <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Last Name*
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="lastName"
//                                         name="lastName"
//                                         value={shippingInfo.lastName}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                                     />
//                                 </div>

//                                 <div className="col-span-2">
//                                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Email Address*
//                                     </label>
//                                     <input
//                                         type="email"
//                                         id="email"
//                                         name="email"
//                                         value={shippingInfo.email}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                                     />
//                                 </div>

//                                 <div className="col-span-2">
//                                     <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Address*
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="address"
//                                         name="address"
//                                         value={shippingInfo.address}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                                     />
//                                 </div>

//                                 <div className="col-span-1">
//                                     <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
//                                         City*
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="city"
//                                         name="city"
//                                         value={shippingInfo.city}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                                     />
//                                 </div>

//                                 <div className="col-span-1">
//                                     <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
//                                         State/Province*
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="state"
//                                         name="state"
//                                         value={shippingInfo.state}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                                     />
//                                 </div>

//                                 <div className="col-span-1">
//                                     <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
//                                         ZIP/Postal Code*
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="zipCode"
//                                         name="zipCode"
//                                         value={shippingInfo.zipCode}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                                     />
//                                 </div>

//                                 <div className="col-span-1">
//                                     <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Country*
//                                     </label>
//                                     <select
//                                         id="country"
//                                         name="country"
//                                         value={shippingInfo.country}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                                     >
//                                         <option value="US">United States</option>
//                                         <option value="CA">Canada</option>
//                                         <option value="UK">United Kingdom</option>
//                                         <option value="AU">Australia</option>
//                                     </select>
//                                 </div>

//                                 <div className="col-span-2">
//                                     <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Phone Number*
//                                     </label>
//                                     <input
//                                         type="tel"
//                                         id="phone"
//                                         name="phone"
//                                         value={shippingInfo.phone}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                                     />
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
//                                         className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
//                                     />
//                                     <label htmlFor="coinley" className="ml-3 block text-sm font-medium text-gray-700">
//                                         Pay with Cryptocurrency
//                                     </label>
//                                 </div>

//                                 {paymentMethod === 'coinley' && (
//                                     <div className="ml-7 mt-2 bg-green-50 p-3 rounded-md">
//                                         <p className="text-sm text-green-700">
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
//                                 className="w-full btn btn-primary"
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

//                         <div className="max-h-96 overflow-y-auto mb-4">
//                             <ul className="divide-y divide-gray-200">
//                                 {cartItems.map((item) => (
//                                     <li key={item.id} className="py-3 flex items-center">
//                                         <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
//                                             <img
//                                                 src={item.imageUrl}
//                                                 alt={item.name}
//                                                 className="w-full h-full object-cover"
//                                             />
//                                         </div>
//                                         <div className="ml-3 flex-1">
//                                             <p className="text-sm font-medium text-gray-900">{item.name}</p>
//                                             <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                                         </div>
//                                         <p className="text-sm font-medium text-gray-900">
//                                             ${(item.price * item.quantity).toFixed(2)}
//                                         </p>
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
//                                 <p className="text-base font-bold text-primary">${total.toFixed(2)}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Coinley Modal */}

//             {showModal && (
//                 <div className="fixed inset-0 z-50 overflow-y-auto">
//                     <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
              
//                         <ThemeProvider initialTheme="light">
//                             <CoinleyProvider
//                                 apiKey="fdb87b029d8fb531589df71e17a8cc55"
//                                 apiSecret="5fe381f54803f100312117028542e952bd5d3d1d8b8df2dd1d0761c030cda4bf"
//                                 apiUrl="https://coinleyserver-production.up.railway.app" // Make sure this URL is correct
//                                 debug={process.env.NODE_ENV === 'development'}
//                             >
//                                 <CoinleyCheckout
//                                     ref={coinleyCheckoutRef}
//                                     apiKey="fdb87b029d8fb531589df71e17a8cc55"
//                                     apiSecret="5fe381f54803f100312117028542e952bd5d3d1d8b8df2dd1d0761c030cda4bf"
//                                     customerEmail={shippingInfo.email || ''}
//                                     merchantName="Little Store"
//                                     onSuccess={handlePaymentSuccess}
//                                     onError={(error) => {
//                                         console.error('Payment error:', error);
//                                         setError('There was a problem with the payment. Please try again.');
//                                     }}
//                                     onClose={handleCloseModal}
//                                     theme="dark"
//                                     autoOpen={true}
//                                 />
//                             </CoinleyProvider>
//                         </ThemeProvider>
                   
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default CheckoutPage;








// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import axios from 'axios';
// import { URL } from '../url';
// import { ThemeProvider, CoinleyProvider, CoinleyCheckout } from 'coinley-sdk';

// function CheckoutPage() {
//     const navigate = useNavigate();
//     const { cartItems, subtotal, clearCart } = useCart();
//     const coinleyCheckoutRef = useRef(null);

//     // Shipping information state
//     const [shippingInfo, setShippingInfo] = useState({
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
//     const shippingCost = subtotal > 50 ? 0 : 0.02;
//     const taxRate = 0.002;
//     const tax = subtotal * taxRate;
//     const total = subtotal + shippingCost + tax;

//     // Handle input change
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setShippingInfo(prev => ({
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
//             // Create order object
//             const order = {
//                 items: cartItems,
//                 customer: shippingInfo,
//                 totals: {
//                     subtotal,
//                     shipping: shippingCost,
//                     tax,
//                     total
//                 },
//                 paymentMethod
//             };

//             // Submit order to backend
//             const orderResponse = await axios.post(`${URL}/api/orders`, order);
//             const orderId = orderResponse.data.id;

//             // Store the order ID for reference
//             localStorage.setItem('currentOrderId', orderId);
//             setCurrentOrderId(orderId);

//             // Open Coinley checkout if crypto payment is selected
//             if (paymentMethod === 'coinley' && coinleyCheckoutRef.current) {
//                 initiatePayment(orderId);
//             } else {
//                 // Handle other payment methods if needed
//                 setProcessing(false);
//             }
//         } catch (err) {
//             console.error('Checkout error:', err);
//             setError('There was a problem processing your order. Please try again.');
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
//                 customerEmail: shippingInfo.email,
//                 metadata: {
//                     orderId: orderId || currentOrderId,
//                     customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
//                     items: cartItems.map(item => ({
//                         id: item.id,
//                         name: item.name,
//                         quantity: item.quantity,
//                         price: item.price
//                     }))
//                 }
//             });
//         }
//     };

//     // Handle successful payment
//     const handlePaymentSuccess = async (paymentId, transactionHash) => {
//         try {
//             const orderId = localStorage.getItem('currentOrderId') || currentOrderId;

//             // Update order with payment info
//             await axios.put(`${URL}/api/orders/${orderId}`, {
//                 paymentStatus: 'paid',
//                 paymentDetails: {
//                     paymentId,
//                     status: 'success',
//                     transactionId: transactionHash,
//                     timestamp: new Date().toISOString()
//                 }
//             });

//             // Clear cart and redirect to success page
//             clearCart();
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
//         setError('There was a problem with the payment. Please try again.');
//         setProcessing(false);
//     };

//     // Handle closing the payment modal
//     const handleCloseModal = () => {
//         setProcessing(false);
//     };

//     // Redirect to cart if no items
//     if (cartItems.length === 0) {
//         navigate('/cart');
//         return null;
//     }

//     return (
//         <div className="container-custom py-8">
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
//                                         value={shippingInfo.firstName}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                                     />
//                                 </div>

//                                 <div className="col-span-1">
//                                     <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Last Name*
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="lastName"
//                                         name="lastName"
//                                         value={shippingInfo.lastName}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                                     />
//                                 </div>

//                                 <div className="col-span-2">
//                                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Email Address*
//                                     </label>
//                                     <input
//                                         type="email"
//                                         id="email"
//                                         name="email"
//                                         value={shippingInfo.email}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                                     />
//                                 </div>

//                                 <div className="col-span-2">
//                                     <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Address*
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="address"
//                                         name="address"
//                                         value={shippingInfo.address}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                                     />
//                                 </div>

//                                 <div className="col-span-1">
//                                     <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
//                                         City*
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="city"
//                                         name="city"
//                                         value={shippingInfo.city}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                                     />
//                                 </div>

//                                 <div className="col-span-1">
//                                     <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
//                                         State/Province*
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="state"
//                                         name="state"
//                                         value={shippingInfo.state}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                                     />
//                                 </div>

//                                 <div className="col-span-1">
//                                     <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
//                                         ZIP/Postal Code*
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="zipCode"
//                                         name="zipCode"
//                                         value={shippingInfo.zipCode}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                                     />
//                                 </div>

//                                 <div className="col-span-1">
//                                     <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Country*
//                                     </label>
//                                     <select
//                                         id="country"
//                                         name="country"
//                                         value={shippingInfo.country}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                                     >
//                                         <option value="US">United States</option>
//                                         <option value="CA">Canada</option>
//                                         <option value="UK">United Kingdom</option>
//                                         <option value="AU">Australia</option>
//                                     </select>
//                                 </div>

//                                 <div className="col-span-2">
//                                     <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Phone Number*
//                                     </label>
//                                     <input
//                                         type="tel"
//                                         id="phone"
//                                         name="phone"
//                                         value={shippingInfo.phone}
//                                         onChange={handleInputChange}
//                                         required
//                                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//                                     />
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
//                                         className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
//                                     />
//                                     <label htmlFor="coinley" className="ml-3 block text-sm font-medium text-gray-700">
//                                         Pay with Cryptocurrency
//                                     </label>
//                                 </div>

//                                 {paymentMethod === 'coinley' && (
//                                     <div className="ml-7 mt-2 bg-green-50 p-3 rounded-md">
//                                         <p className="text-sm text-green-700">
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
//                                 className="w-full btn btn-primary"
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

//                         <div className="max-h-96 overflow-y-auto mb-4">
//                             <ul className="divide-y divide-gray-200">
//                                 {cartItems.map((item) => (
//                                     <li key={item.id} className="py-3 flex items-center">
//                                         <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
//                                             <img
//                                                 src={item.imageUrl}
//                                                 alt={item.name}
//                                                 className="w-full h-full object-cover"
//                                             />
//                                         </div>
//                                         <div className="ml-3 flex-1">
//                                             <p className="text-sm font-medium text-gray-900">{item.name}</p>
//                                             <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                                         </div>
//                                         <p className="text-sm font-medium text-gray-900">
//                                             ${(item.price * item.quantity).toFixed(2)}
//                                         </p>
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
//                                 <p className="text-base font-bold text-primary">${total.toFixed(2)}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Coinley Checkout Component */}
//             <ThemeProvider initialTheme="light">
//                 <CoinleyProvider
//                     apiKey="fdb87b029d8fb531589df71e17a8cc55"
//                     apiSecret="5fe381f54803f100312117028542e952bd5d3d1d8b8df2dd1d0761c030cda4bf"
//                     // apiUrl="https://coinleyserver-production.up.railway.app"
//                     apiUrl="http://localhost:9000"
//                     debug={process.env.NODE_ENV === 'development'}
//                 >
//                     <CoinleyCheckout
//                         ref={coinleyCheckoutRef}
//                         apiKey="fdb87b029d8fb531589df71e17a8cc55"
//                         apiSecret="5fe381f54803f100312117028542e952bd5d3d1d8b8df2dd1d0761c030cda4bf"
//                         apiUrl="http://localhost:9000"
//                         // apiUrl="https://coinleyserver-production.up.railway.app"
//                         customerEmail={shippingInfo.email || ''}
//                         merchantName="Little Store"
//                         onSuccess={handlePaymentSuccess}
//                         onError={handlePaymentError}
//                         onClose={handleCloseModal}
//                         theme="light"
//                         autoOpen={false}
//                     />
//                 </CoinleyProvider>
//             </ThemeProvider>
//         </div>
//     );
// }


import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { URL } from '../url';
import { ThemeProvider, CoinleyProvider, CoinleyCheckout } from 'coinley-checkout';
import { Network } from 'lucide-react';

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
    
    // Calculate order totals - using real cart data from context
    const shippingCost = subtotal > 50 ? 0 : 0.09;
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const total = subtotal + shippingCost + tax;
    
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
            // Create order object with real cart data
            const order = {
                items: cartItems,
                customer: customerInfo,
                totals: {
                    subtotal,
                    shipping: shippingCost,
                    tax,
                    total
                },
                paymentMethod
            };
            
            // Make real API call to create order
            const orderResponse = await axios.post(`${URL}/api/orders`, order);
            const orderId = orderResponse.data.id;
            
            // Store order ID for reference
            setCurrentOrderId(orderId);
            localStorage.setItem('currentOrderId', orderId);
            
            // Initiate payment if crypto payment method is selected
            if (paymentMethod === 'coinley' && coinleyCheckoutRef.current) {
                initiatePayment(orderId);
            } else {
                // Handle other payment methods if needed
                setProcessing(false);
            }
        } catch (err) {
            console.error('Checkout error:', err);
            setError(err.response?.data?.error || 'There was a problem processing your order. Please try again.');
            setProcessing(false);
        }
    };
    
    // Initialize payment with Coinley
    const initiatePayment = (orderId) => {
        if (coinleyCheckoutRef.current) {
            // Open the checkout with the correct parameters
            coinleyCheckoutRef.current.open({
                amount: total,
                currency: 'USDT',
                network:'ethereum',
                customerEmail: customerInfo.email,
                callbackUrl: `${window.location.origin}/api/webhooks/payments/coinley`, // Your webhook endpoint
                metadata: {
                    orderId: orderId,
                    customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
                    items: cartItems.map(item => ({
                        id: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            });
        } else {
            console.error("Coinley checkout ref is not available");
            setError("Payment gateway initialization failed. Please try again.");
            setProcessing(false);
        }
    };
    
    // Handle successful payment
    const handlePaymentSuccess = async (paymentId, transactionHash) => {
        try {
            const orderId = currentOrderId || localStorage.getItem('currentOrderId');
            
            // Update order with payment details
            await axios.put(`${URL}/api/orders/${orderId}`, {
                paymentStatus: 'paid',
                paymentDetails: {
                    paymentId,
                    status: 'success',
                    transactionId: transactionHash,
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
                        paymentId
                    }
                }
            });
        } catch (err) {
            console.error('Payment update error:', err);
            setError('Payment was received, but we had trouble updating your order. Please contact support.');
        } finally {
            setProcessing(false);
        }
    };
    
    // Handle payment error
    const handlePaymentError = (error) => {
        console.error('Payment error:', error);
        setError(`Payment failed: ${error.message || 'Unknown error'}`);
        setProcessing(false);
    };
    
    // Handle closing the payment modal
    const handleCloseModal = () => {
        setProcessing(false);
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
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="US">United States</option>
                                        <option value="CA">Canada</option>
                                        <option value="UK">United Kingdom</option>
                                        <option value="AU">Australia</option>
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
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <label htmlFor="coinley" className="ml-3 block text-sm font-medium text-gray-700">
                                        Pay with Cryptocurrency
                                    </label>
                                </div>

                                {paymentMethod === 'coinley' && (
                                    <div className="ml-7 mt-2 bg-blue-50 p-3 rounded-md">
                                        <p className="text-sm text-blue-700">
                                            You'll be redirected to complete the payment securely using our cryptocurrency gateway.
                                        </p>
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

                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={processing}
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

                            <div className="flex justify-between">
                                <p className="text-sm text-gray-600">Tax (8%)</p>
                                <p className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</p>
                            </div>

                            <div className="flex justify-between border-t pt-3">
                                <p className="text-base font-medium text-gray-900">Total</p>
                                <p className="text-base font-bold text-blue-600">${total.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coinley Checkout Component */}
            <ThemeProvider initialTheme="light">
                <CoinleyProvider
                    apiKey="fdb87b029d8fb531589df71e17a8cc55"
                    apiSecret="5fe381f54803f100312117028542e952bd5d3d1d8b8df2dd1d0761c030cda4bf"
                    apiUrl="http://localhost:9000"
                    debug={process.env.NODE_ENV === 'development'}
                >
                    <CoinleyCheckout
                        ref={coinleyCheckoutRef}
                        customerEmail={customerInfo.email || ''}
                        merchantName="FreshBites"
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        onClose={handleCloseModal}
                        theme="dark"
                        autoOpen={false}
                        // testMode={process.env.NODE_ENV === 'development'} // Only use test mode in development
                        testMode={false}
                        preferredNetwork="ethereum" // Prefer Ethereum network
                        preferredWallet="metamask" // Explicitly request MetaMask
                    />
                </CoinleyProvider>
            </ThemeProvider>
        </div>
    );
}

export default CheckoutPage;