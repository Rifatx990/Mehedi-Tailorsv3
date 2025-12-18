import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  const handleAddToCartFromWishlist = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <i className="bi bi-heart display-1 text-muted mb-3"></i>
          <h3>Your wishlist is empty</h3>
          <p className="text-muted mb-4">Save items you like to your wishlist</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0">My Wishlist</h1>
        <div>
          <span className="text-muted me-3">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
          </span>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your wishlist?')) {
                wishlist.forEach(item => removeFromWishlist(item.id));
              }
            }}
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="row g-4">
        {wishlist.map((product) => (
          <div className="col-md-3" key={product.id}>
            <div className="card h-100 shadow-sm">
              <div className="position-relative">
                <img
                  src={product.image || '/api/placeholder/300/300'}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <button
                  className="btn btn-link position-absolute top-0 end-0 p-2"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  <i className="bi bi-heart-fill text-danger"></i>
                </button>
              </div>
              
              <div className="card-body d-flex flex-column">
                <h6 className="card-title">{product.name}</h6>
                <p className="card-text text-muted small flex-grow-1">
                  {product.description?.substring(0, 60)}...
                </p>
                
                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <h5 className="text-primary mb-0">₹{product.price}</h5>
                  
                  <div className="btn-group">
                    <Link
                      to={`/product/${product.id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View
                    </Link>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAddToCartFromWishlist(product)}
                    >
                      <i className="bi bi-cart-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <h5 className="mb-3">Recently Viewed</h5>
        <div className="row g-3">
          {/* You would map through recently viewed products here */}
          <div className="col-md-2">
            <div className="card border">
              <img
                src="/api/placeholder/200/200"
                className="card-img-top"
                alt="Recent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
