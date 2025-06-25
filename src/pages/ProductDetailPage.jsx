// import { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import axios from 'axios';
// import { URL } from '../url';

// function ProductDetailPage() {
//   const { id } = useParams();
//   const [product, setProduct] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const { addToCart } = useCart();


//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get(`${URL}/api/products/${id}`);
//         setProduct(response.data);
//         console.log("product", response.data)
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching product:', err);
//         setError('Failed to load product details. Please try again later.');
//         setLoading(false);
        
      
//         const found = product?.find(p => p.id === parseInt(id));
//         if (found) {
//           setProduct(found);
//         } else {
//           setError('Product not found.');
//         }
//       }
//     };


//     useEffect(() => {
//     fetchProduct();
//   }, [id]);

//   const handleQuantityChange = (e) => {
//     const value = parseInt(e.target.value);
//     setQuantity(value >= 1 ? value : 1);
//   };

//   const handleAddToCart = () => {

//     console.log("Adding to cart:", product, quantity);
  
//     if (!addToCart) {
//       console.error("addToCart function is undefined!");
//       return;
//     }
  
//     if (!product || Object.keys(product).length === 0) {
//       console.error("No product found to add to cart");
//       return;
//     }
  


//     addToCart(product, quantity);
//   };

//   if (loading) {
//     return (
//       <div className="container-custom py-12 flex justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   if (error || !product) {
//     return (
//       <div className="container-custom py-12">
//         <div className="bg-red-50 p-4 rounded-md">
//           <p className="text-red-500">{error || 'Product not found'}</p>
//           <Link to="/products" className="text-primary hover:underline mt-2 inline-block">
//             Back to Products
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container-custom py-8 px-9 md:px-24">
//       <div className="mb-4">
//         <Link to="/products" className="text-primary hover:underline flex items-center">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
//           </svg>
//           Back to Products
//         </Link>
//       </div>
      
//       <div className="bg-white rounded-lg shadow-md overflow-hidden md:px-24">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
//           {/* Product Image */}
//           <div className="aspect-w-4 aspect-h-3 md:aspect-w-3 md:aspect-h-4">
//             <img 
//               src={product.imageUrl} 
//               alt={product.name} 
//               className="w-full h-full object-cover rounded-lg"
//             />
//           </div>
          
//           {/* Product Details */}
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2 font-bricolage">{product.name}</h1>
            
//             <div className="flex items-center mb-4">
//               <span className="text-2xl font-bold text-gray-900">${Number (product?.price)?.toFixed(2)}</span>
//               <span className="text-gray-500 ml-2">/ {product.unit}</span>
//             </div>
            
//             <p className="text-gray-700 mb-6">{product.description}</p>
            
//             {/* Nutrition Info (if available) */}
//             {product.nutrition && (
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold mb-2">Nutrition Facts</h3>
//                 <div className="grid grid-cols-2 gap-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Calories:</span>
//                     <span>{product.nutrition.calories}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Fat:</span>
//                     <span>{product.nutrition.fat}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Carbs:</span>
//                     <span>{product.nutrition.carbs}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Protein:</span>
//                     <span>{product.nutrition.protein}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Fiber:</span>
//                     <span>{product.nutrition.fiber}</span>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {/* Origin (if available) */}
//             {product.origin && (
//               <div className="mb-6">
//                 <span className="text-sm text-gray-500">Origin: {product.origin}</span>
//               </div>
//             )}
            
//             {/* Add to Cart */}
//             <div className="flex items-center gap-4">
//               <div className="w-24">
//                 <label htmlFor="quantity" className="sr-only">Quantity</label>
//                 <input
//                   type="number"
//                   id="quantity"
//                   min="1"
//                   value={quantity}
//                   onChange={handleQuantityChange}
//                   className="w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
//                 />
//               </div>
              
//               <button 
//                 onClick={handleAddToCart}
//                 className="bg-[#7042D2] py-2 text-white rounded-2xl font-bricolage px-16"
//               >
//                 Add to Cart
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProductDetailPage;





import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { URL } from '../url';

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate()

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${URL}/api/products/${id}`);
      setProduct(response.data);
      console.log("product", response.data)
      setLoading(false);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product details. Please try again later.');
      setLoading(false);
      
      const found = product?.find(p => p.id === parseInt(id));
      if (found) {
        setProduct(found);
      } else {
        setError('Product not found.');
      }
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value >= 1 ? value : 1);
  };

  const handleAddToCart = () => {
    console.log("Adding to cart:", product, quantity);
  
    if (!addToCart) {
      console.error("addToCart function is undefined!");
      return;
    }
  
    if (!product || Object.keys(product).length === 0) {
      console.error("No product found to add to cart");
      return;
    }

    addToCart(product, quantity);
    setShowModal(true);
    
    // Auto-hide modal after 3 seconds
    setTimeout(() => {
      setShowModal(false);
    }, 93000);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="container-custom py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-custom py-12">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-500">{error || 'Product not found'}</p>
          <Link to="/products" className="text-primary hover:underline mt-2 inline-block">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 px-9 md:px-24">
      <div className="mb-4">
        <Link to="/products" className="text-primary hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Products
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden md:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Image */}
          <div className="aspect-w-4 aspect-h-3 md:aspect-w-3 md:aspect-h-4">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-bricolage">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-gray-900">${Number (product?.price)?.toFixed(2)}</span>
              <span className="text-gray-500 ml-2">/ {product.unit}</span>
            </div>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            {/* Nutrition Info (if available) */}
            {product.nutrition && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Nutrition Facts</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Calories:</span>
                    <span>{product.nutrition.calories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fat:</span>
                    <span>{product.nutrition.fat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carbs:</span>
                    <span>{product.nutrition.carbs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Protein:</span>
                    <span>{product.nutrition.protein}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fiber:</span>
                    <span>{product.nutrition.fiber}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Origin (if available) */}
            {product.origin && (
              <div className="mb-6">
                <span className="text-sm text-gray-500">Origin: {product.origin}</span>
              </div>
            )}
            
            {/* Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="w-24">
                <label htmlFor="quantity" className="sr-only">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full border-gray-300 rounded-md shadow-sm py-2 px-3"
                />
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="bg-[#7042D2] py-2 text-white rounded-2xl font-bricolage px-16"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
   {showModal && (
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
            className="flex px-2 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium items-center justify-center"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => {
              closeModal();
              setTimeout(() => {
                navigate("/cart");
              }, 10);
            }}
            className="flex px-4 py-2 bg-[#7042D2] text-white rounded-lg hover:bg-[#5c35b8] transition-colors font-medium text-center items-center justify-center"
          >
            View Cart
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default ProductDetailPage;