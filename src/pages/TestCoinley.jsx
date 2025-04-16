// // src/pages/TestCoinley.jsx
// import { useState, useRef, useEffect } from 'react';
// import { ThemeProvider, CoinleyProvider, CoinleyCheckout } from 'coinley-checkout';

// function TestCoinley() {
//   const coinleyCheckoutRef = useRef(null);
//   const [paymentResult, setPaymentResult] = useState(null);
//   const [testAmount, setTestAmount] = useState(9.99);
//   const [testCurrency, setTestCurrency] = useState('USDT');
//   const [testMode, setTestMode] = useState(true);
//   const [debugMode, setDebugMode] = useState(true);
//   const [isProcessing, setIsProcessing] = useState(false);

//   // API credentials
//   const apiKey = "afb78ff958350b9067798dd077c28459"; // Replace with your API key if different
//   const apiSecret = "c22d3879eff18c2d3f8f8a61d4097c230a940356a3d139ffceee11ba65b1a34c"; // Replace with your API secret if different
//   const apiUrl = "https://coinleyserver-production.up.railway.app";

//   const handleCreatePayment = () => {
//     if (coinleyCheckoutRef.current) {
//       setIsProcessing(true);
      
//       coinleyCheckoutRef.current.open({
//         amount: testAmount,
//         currency: testCurrency,
//         customerEmail: 'test@example.com',
//         metadata: {
//           orderId: `TEST-${Date.now()}`,
//           customerName: 'Test Customer',
//           items: [
//             { id: 1, name: 'Test Product', price: testAmount, quantity: 1 }
//           ]
//         }
//       });
//     }
//   };

//   const handlePaymentSuccess = (paymentId, transactionHash) => {
//     setPaymentResult({
//       status: 'success',
//       paymentId,
//       transactionHash,
//       timestamp: new Date().toISOString()
//     });
//     setIsProcessing(false);
//   };

//   const handlePaymentError = (error) => {
//     setPaymentResult({
//       status: 'error',
//       message: error.message || 'Unknown error occurred',
//       timestamp: new Date().toISOString()
//     });
//     setIsProcessing(false);
//   };

//   const handleClose = () => {
//     setIsProcessing(false);
//   };

//   return (
//     <div className="container mx-auto py-8 px-4 max-w-4xl">
//       <h1 className="text-3xl font-bold mb-6">Coinley Checkout Test Page</h1>
      
//       <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
//         <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Amount ($)
//             </label>
//             <input
//               type="number"
//               value={testAmount}
//               onChange={(e) => setTestAmount(parseFloat(e.target.value) || 0)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               min="0.01"
//               step="0.01"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Currency
//             </label>
//             <select
//               value={testCurrency}
//               onChange={(e) => setTestCurrency(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="USDT">USDT</option>
//               <option value="USDC">USDC</option>
//               <option value="BNB">BNB</option>
//               <option value="SOL">SOL</option>
//               <option value="USDC_SOL">USDC (Solana)</option>
//             </select>
//           </div>
//         </div>
        
//         <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="testMode"
//               checked={testMode}
//               onChange={(e) => setTestMode(e.target.checked)}
//               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//             />
//             <label htmlFor="testMode" className="ml-2 block text-sm text-gray-700">
//               Test Mode (simulates successful payments)
//             </label>
//           </div>
          
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="debugMode"
//               checked={debugMode}
//               onChange={(e) => setDebugMode(e.target.checked)}
//               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//             />
//             <label htmlFor="debugMode" className="ml-2 block text-sm text-gray-700">
//               Debug Mode (logs to console)
//             </label>
//           </div>
//         </div>
        
//         <div className="flex justify-center">
//           <button
//             onClick={handleCreatePayment}
//             disabled={isProcessing}
//             className={`py-2 px-6 rounded-md font-medium ${
//               isProcessing
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-blue-600 hover:bg-blue-700 text-white'
//             }`}
//           >
//             {isProcessing ? (
//               <span className="flex items-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Processing...
//               </span>
//             ) : (
//               'Create Test Payment'
//             )}
//           </button>
//         </div>
//       </div>
      
//       {paymentResult && (
//         <div className={`mb-8 p-6 rounded-lg shadow-md ${
//           paymentResult.status === 'success' 
//             ? 'bg-green-50 border border-green-200' 
//             : 'bg-red-50 border border-red-200'
//         }`}>
//           <h2 className="text-xl font-semibold mb-4">
//             Payment Result
//             <span className="ml-2 text-sm font-normal text-gray-500">
//               {new Date(paymentResult.timestamp).toLocaleString()}
//             </span>
//           </h2>
          
//           <div className="bg-white p-4 rounded border">
//             <pre className="whitespace-pre-wrap overflow-auto text-sm">
//               {JSON.stringify(paymentResult, null, 2)}
//             </pre>
//           </div>
          
//           {paymentResult.status === 'success' && (
//             <div className="mt-4 p-4 bg-green-100 rounded-md">
//               <p className="text-green-800">
//                 ✅ Payment processed successfully! The QR code payment feature works correctly.
//               </p>
//             </div>
//           )}
//         </div>
//       )}
      
//       <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-600">
//         <p>
//           <strong>Note:</strong> This test page uses the linked local version of the Coinley Checkout SDK.
//           Make sure you've run <code>npm link coinley-checkout</code> in this project.
//         </p>
//       </div>

//       {/* Coinley checkout component */}
//       <ThemeProvider initialTheme="light">
//         <CoinleyProvider
//           apiKey={apiKey}
//           apiSecret={apiSecret}
//           apiUrl={apiUrl}
//           debug={debugMode}
//         >
//           <CoinleyCheckout
//             ref={coinleyCheckoutRef}
//             merchantName="Test Store"
//             onSuccess={handlePaymentSuccess}
//             onError={handlePaymentError}
//             onClose={handleClose}
//             testMode={testMode}
//           />
//         </CoinleyProvider>
//       </ThemeProvider>
//     </div>
//   );
// }

// export default TestCoinley;









// // TestCoinley.jsx
// import React, { useRef } from 'react';
// import { 
//   ThemeProvider, 
//   CoinleyProvider, 
//   CoinleyCheckout 
// } from 'coinley-checkout';

// function TestCoinley() {
//   const checkoutRef = useRef(null);
  
//   const handleCreatePayment = () => {
//     if (checkoutRef.current) {
//       checkoutRef.current.open({
//         amount: 10.99,
//         currency: 'USDT'
//       });
//     }
//   };
  
//   return (
//     <div>
//       <h1>Test Coinley QR Code</h1>
//       <button onClick={handleCreatePayment}>
//         Create Test Payment
//       </button>
      
//       <ThemeProvider>
//         <CoinleyProvider
//           apiKey="afb78ff958350b9067798dd077c28459"
//           apiSecret="c22d3879eff18c2d3f8f8a61d4097c230a940356a3d139ffceee11ba65b1a34c"
//           apiUrl="https://coinleyserver-production.up.railway.app"
//           debug={true}
//         >
//           <CoinleyCheckout
//             ref={checkoutRef}
//             merchantName="Test Merchant"
//             onSuccess={(id, hash) => console.log('Success:', id, hash)}
//             onError={(err) => console.error('Error:', err)}
//             testMode={false} // Important: Set to false to see tabs
//             debug={true}
//           />
//         </CoinleyProvider>
//       </ThemeProvider>
//     </div>
//   );
// }

// export default TestCoinley;



// TestCoinley.jsx
import React, { useRef, useState } from 'react';
import { ThemeProvider, CoinleyProvider, CoinleyCheckout } from 'coinley-checkout';

function TestCoinley() {
  const coinleyRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // API credentials
  const apiKey = "afb78ff958350b9067798dd077c28459";
  const apiSecret = "c22d3879eff18c2d3f8f8a61d4097c230a940356a3d139ffceee11ba65b1a34c";
  const apiUrl = "https://coinleyserver-production.up.railway.app";

  const handleCreatePayment = () => {
    if (coinleyRef.current) {
      setIsProcessing(true);
      
      // Create a simple test payment
      coinleyRef.current.open({
        amount: 10.99,
        currency: 'USDT',
        customerEmail: 'test@example.com'
      });
    }
  };

  const handleSuccess = (paymentId, hash) => {
    console.log('Payment successful', { paymentId, hash });
    setIsProcessing(false);
    alert('Payment successful!');
  };

  const handleError = (error) => {
    console.error('Payment error', error);
    setIsProcessing(false);
    alert(`Payment error: ${error.message || 'Unknown error'}`);
  };

  const handleClose = () => {
    console.log('Payment modal closed');
    setIsProcessing(false);
  };
  
  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Coinley QR Code Test</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-blue-800 font-medium mb-2">Important:</p>
        <ul className="list-disc pl-5 text-blue-700 space-y-1">
          <li>This test will create a payment with Coinley</li>
          <li>You should see both "Connect Wallet" and "QR Code" options</li>
          <li>Test Mode is disabled to ensure all payment options show</li>
        </ul>
      </div>
      
      <button
        onClick={handleCreatePayment}
        disabled={isProcessing}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
          isProcessing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isProcessing ? 'Processing...' : 'Test Coinley Payment'}
      </button>
      
      {/* Coinley components */}
      <ThemeProvider initialTheme="light">
        <CoinleyProvider
          apiKey={apiKey}
          apiSecret={apiSecret}
          apiUrl={apiUrl}
          debug={true}
        >
          <CoinleyCheckout
            ref={coinleyRef}
            merchantName="Test Store"
            onSuccess={handleSuccess}
            onError={handleError}
            onClose={handleClose}
            testMode={false} // Important: Set to false to show both payment options
          />
        </CoinleyProvider>
      </ThemeProvider>
    </div>
  );
}

export default TestCoinley;