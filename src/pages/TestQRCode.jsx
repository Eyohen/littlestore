// TestQRCode.jsx
import React, { useState } from 'react';

// Simple QR Code Component (copy of your implementation)
const QRCode = ({ walletAddress, amount, currency, theme = 'light' }) => {
  return (
    <div className="flex flex-col items-center">
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} mb-3`}>
        {/* Simple placeholder for QR code */}
        <div style={{ width: '200px', height: '200px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          QR Code Placeholder
        </div>
      </div>
      <div className="text-sm">
        Scan with your wallet app to pay
      </div>
      {walletAddress && (
        <div className="mt-3 w-full">
          <p className="text-xs mb-1">
            Send {amount} {currency} to:
          </p>
          <div className="text-xs font-mono p-2 rounded overflow-auto break-all bg-gray-100">
            {walletAddress}
          </div>
        </div>
      )}
    </div>
  );
};

// Simplified Test Component
function TestQRCode() {
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  
  return (
    <div className="container mx-auto p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">QR Code Payment Test</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-3">Payment Options</h2>
          
          {/* Payment Method Tabs */}
          <div className="mb-4 border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setPaymentMethod('wallet')}
                className={`py-2 px-4 text-sm font-medium ${
                  paymentMethod === 'wallet' 
                    ? 'bg-gray-100 text-gray-800 rounded-t-md' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Connect Wallet
              </button>
              <button
                onClick={() => setPaymentMethod('qrcode')}
                className={`py-2 px-4 text-sm font-medium ${
                  paymentMethod === 'qrcode' 
                    ? 'bg-gray-100 text-gray-800 rounded-t-md' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                QR Code
              </button>
            </div>
          </div>
          
          {/* Content based on selected payment method */}
          {paymentMethod === 'wallet' ? (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <img 
                  src="https://metamask.io/images/metamask-fox.svg" 
                  alt="MetaMask" 
                  className="w-8 h-8 mr-2"
                />
                <div>
                  <h3 className="font-medium text-gray-800">
                    Pay with MetaMask
                  </h3>
                  <p className="text-sm text-gray-600">
                    Click 'Connect Wallet' to proceed with payment
                  </p>
                </div>
              </div>
              <button className="mt-3 w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md">
                Connect Wallet
              </button>
            </div>
          ) : (
            <div className="p-4 bg-blue-50 rounded-lg">
              <QRCode 
                walletAddress="0x742d35Cc6634C0532925a3b844Bc454e4438f44e" 
                amount={10.99}
                currency="USDT"
                theme="light"
              />
            </div>
          )}
          
          <div className="mt-6">
            <button className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md">
              Pay Now
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Current State:</h2>
        <pre className="bg-gray-100 p-4 rounded-md">
          {JSON.stringify({ paymentMethod }, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default TestQRCode;