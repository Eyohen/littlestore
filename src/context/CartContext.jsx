// import { createContext, useContext, useState, useEffect } from 'react';

// const CartContext = createContext();

// export function useCart() {
//   return useContext(CartContext);
// }

// export function CartProvider({ children }) {
//   // Initialize cart from localStorage if available
//   const [cartItems, setCartItems] = useState(() => {
//     const savedCart = localStorage.getItem('cart');
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cartItems));
//   }, [cartItems]);

//   // Add item to cart
//   const addToCart = (product, quantity = 1) => {
//     setCartItems(prevItems => {
//       const existingItem = prevItems.find(item => item.id === product.id);
      
//       if (existingItem) {
//         // Update quantity if item already exists
//         return prevItems.map(item =>
//           item.id === product.id 
//             ? { ...item, quantity: item.quantity + quantity } 
//             : item
//         );
//       } else {
//         // Add new item
//         return [...prevItems, { ...product, quantity }];
//       }
//     });
//   };

//   // Remove item from cart
//   const removeFromCart = (productId) => {
//     setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
//   };

//   // Update item quantity
//   const updateQuantity = (productId, quantity) => {
//     if (quantity <= 0) {
//       removeFromCart(productId);
//       return;
//     }

//     setCartItems(prevItems => 
//       prevItems.map(item => 
//         item.id === productId ? { ...item, quantity } : item
//       )
//     );
//   };

//   // Clear the entire cart
//   const clearCart = () => {
//     setCartItems([]);
//   };

//   // Calculate subtotal
//   const subtotal = cartItems.reduce(
//     (total, item) => total + item.price * item.quantity, 
//     0
//   );

//   const value = {
//     cartItems,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     subtotal
//   };

//   return (
//     <CartContext.Provider value={value}>
//       {children}
//     </CartContext.Provider>
//   );
// }



import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  // Initialize cart from localStorage if available
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Add modal state management
  const [lastAddedProduct, setLastAddedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [lastAddedQuantity, setLastAddedQuantity] = useState(1);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { ...product, quantity }];
      }
    });

    // Set the last added product for the modal
    setLastAddedProduct(product);
    setLastAddedQuantity(quantity);
    setShowModal(true);
    
    // Auto-hide modal after 3 seconds
    setTimeout(() => {
      setShowModal(false);
    }, 3000);
  };

  // Close modal function
  const closeModal = () => {
    setShowModal(false);
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    // Add modal related properties/functions
    lastAddedProduct,
    lastAddedQuantity,
    showModal,
    closeModal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}