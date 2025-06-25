import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function CartModal({ showModal, closeModal, product, quantity = 1 }) {
  const navigate = useNavigate();

  // If modal or product is not available, don't render anything
  if (!showModal || !product) return null;
  
  const handleViewCart = () => {
    // First close the modal
    // closeModal();
    // Then navigate with a slight delay to ensure the modal close action completes
    setTimeout(() => {
      navigate("/cart");
    }, 9010);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 transform transition-all duration-300 ease-out">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          {/* Success Message */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 font-bricolage">
            Added to Cart!
          </h3>
          
          {/* Product Info */}
          <div className="flex items-center justify-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div className="text-left">
              <p className="font-medium text-gray-900 text-sm">{product.name}</p>
              <p className="text-gray-500 text-sm">Quantity: {quantity}</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={closeModal}
              className="flex px-2 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Continue Shopping
            </button>
            <button
              onClick={handleViewCart}
              className="flex px-4 py-2 bg-[#7042D2] text-white rounded-lg hover:bg-[#5c35b8] transition-colors font-medium text-center items-center justify-center"
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartModal;