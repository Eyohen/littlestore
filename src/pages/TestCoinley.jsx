import React, { useState } from 'react';
import { ThemeProvider, CoinleyProvider, CoinleyModal } from 'coinley-sdk';

function TestCoinley() {
  const [showModal, setShowModal] = useState(false);

  const handleSuccess = (txHash) => {
    console.log('Payment successful!', txHash);
    setShowModal(false);
  };

  const handleClose = () => {
    console.log('Modal closed');
    setShowModal(false);
  };

  return (
    <ThemeProvider>
      <CoinleyProvider
        apiKey="your_api_key"
        apiSecret="your_api_secret"
        debug={true}
      >
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1>Coinley SDK Test</h1>
          <button 
            onClick={() => setShowModal(true)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4F46E5',
              color: 'white',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              marginTop: '1rem'
            }}
          >
            Open Payment Modal
          </button>

          {showModal && (
            <CoinleyModal
              onClose={handleClose}
              onSuccess={handleSuccess}
              customerEmail="test@example.com"
              merchantName="Test Store"
              withThemeToggle={true}
              showClose={true}
            />
          )}
        </div>
      </CoinleyProvider>
    </ThemeProvider>
  );
}

export default TestCoinley;