import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { URL } from '../url';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');


    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${URL}/api/products`);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
        
    
      }
    };



    useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products by category and search term
  const filteredProducts = products.filter(product => {
    // Filter by category
    if (filter !== 'all' && product.category !== filter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="container-custom py-8 px-9">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>
      
      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`btn ${filter === 'all' ? 'btn-primary' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('fruits')}
            className={`btn ${filter === 'fruits' ? 'btn-primary' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            Fruits
          </button>
          <button
            onClick={() => setFilter('vegetables')}
            className={`btn ${filter === 'vegetables' ? 'btn-primary' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            Vegetables
          </button>
        </div>
      </div>
      
      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductsPage;