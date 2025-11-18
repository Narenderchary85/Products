import React, { JSX, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence ,Variants} from "framer-motion";
import { 
  FiSearch, 
  FiTruck,
  FiArrowLeft,
  FiArrowRight
} from "react-icons/fi";
import { 
  FaRegHeart, 
  FaHeart, 
  FaShoppingCart, 
  FaStar, 
  FaStarHalfAlt,
  FaRegStar
} from "react-icons/fa";

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/products?query=${query}&category=${category}&sort=${sort}&page=${page}&limit=${limit}`
      );
      if (!res.ok) throw new Error("Failed to load products");

      const data = await res.json();
      setProducts(data.items);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, query, category, sort]);

  const totalPages = Math.ceil(total / limit);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const renderStars = (rating: number) => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">Discover amazing products at great prices</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 w-full relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Home">Home & Kitchen</option>
              <option value="Sports">Sports & Fitness</option>
            </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Sort By</option>
            <option value="name">Name: A to Z</option>
            <option value="-name">Name: Z to A</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-rating">Highest Rated</option>
          </select>
          </div>
        </motion.div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-16"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8"
          >
            <p className="text-red-700 text-lg">Error loading products: {error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {!loading && products.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setQuery("");
                setCategory("");
                setSort("");
                setPage(1);
              }}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        <AnimatePresence>
          {!loading && products.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
            >
              {products.map((product: any) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  layout
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden bg-gray-100 group">
                      <div className="w-full h-48 relative">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            
                            }}
                          />
                        ) : null}

                        <div 
                          className={`image-fallback w-full h-full flex items-center justify-center ${product.image ? 'hidden' : 'flex'}`}
                          style={{
                            background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)'
                          }}
                        >
                          <div className="text-center">
                            <span className="text-5xl font-bold text-white mb-2 block">
                              {product.name?.charAt(0).toUpperCase() || '?'}
                            </span>
                            <span className="text-white text-sm font-medium opacity-90">
                              {product.name || 'Product'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 z-10"
                      >
                        {wishlist.has(product.id) ? (
                          <FaHeart className="text-red-500 text-lg" />
                        ) : (
                          <FaRegHeart className="text-gray-400 text-lg hover:text-red-500" />
                        )}
                      </button>
                      {!product.inStock && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium z-10">
                          Out of Stock
                        </div>
                      )}
                    </div>

                  <div className="p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {product.category}
                    </p>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {renderStars(product.rating || 4.5)}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product.reviewCount || 124})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                      {product.discount && (
                        <span className="text-sm text-green-600 font-medium">
                          {product.discount}% off
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <FiTruck className="text-green-600" />
                      <span>Free delivery</span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/products/${product.id}`}
                        className="flex-1 bg-gray-100 text-gray-900 py-2 px-4 rounded-lg text-center font-medium hover:bg-gray-200 transition-colors"
                      >
                        View Details
                      </Link>
                      <button
                        disabled={!product.inStock}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          product.inStock
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <FaShoppingCart />
                        Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && products.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between border-t border-gray-200 pt-8"
          >
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                page === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiArrowLeft />
              Previous
            </button>

            <div className="flex items-center gap-2">
              <span className="text-gray-700">
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                page === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Next
              <FiArrowRight />
            </button>
          </motion.nav>
        )}
      </div>
    </section>
  );
}