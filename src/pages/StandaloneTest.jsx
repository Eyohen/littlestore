// StandaloneTest.jsx
import React, { useState } from 'react';

function StandaloneTest() {
  const [showQRCode, setShowQRCode] = useState(false);
  
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Payment Method Test</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setShowQRCode(false)}
              className={`py-2 px-4 text-sm font-medium ${
                !showQRCode ? 'bg-gray-100 text-gray-800 rounded-t-md' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Connect Wallet
            </button>
            <button
              onClick={() => setShowQRCode(true)}
              className={`py-2 px-4 text-sm font-medium ${
                showQRCode ? 'bg-gray-100 text-gray-800 rounded-t-md' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              QR Code
            </button>
          </div>
        </div>
        
        {showQRCode ? (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white rounded-lg mb-3">
                {/* Simple QR code placeholder */}
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                  QR Code
                </div>
              </div>
              <div className="text-sm text-gray-700">
                Scan with your wallet app to pay
              </div>
              <div className="mt-3 w-full">
                <p className="text-xs text-gray-500 mb-1">
                  Send 10.99 USDT to:
                </p>
                <div className="text-xs font-mono p-2 rounded bg-gray-100 text-gray-700 overflow-auto break-all">
                  0x742d35Cc6634C0532925a3b844Bc454e4438f44e
                </div>
              </div>
            </div>
          </div>
        ) : (
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
        )}
        
        <div className="mt-6">
          <button className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md">
            Pay Now
          </button>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <h2 className="font-medium text-yellow-800 mb-2">Demonstration Purpose</h2>
        <p className="text-sm text-yellow-700">
          This is a standalone demonstration of the UI for two payment options: 
          Connect Wallet and QR Code. Click the tabs above to switch between them.
        </p>
      </div>
    </div>
  );
}

export default StandaloneTest;