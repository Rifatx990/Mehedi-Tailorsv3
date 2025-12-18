import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart, addToWishlist, removeFromWishlist } = useCart();

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
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
          onClick={handleWishlistToggle}
        >
          <i className={`bi ${isWishlisted ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
        </button>
        {product.stock <= 10 && product.stock > 0 && (
          <span className="badge bg-warning position-absolute top-0 start-0 m-2">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="badge bg-danger position-absolute top-0 start-0 m-2">
            Out of Stock
          </span>
        )}
      </div>
      
      <div className="card-body d-flex flex-column">
        <div className="mb-2">
          <span className="badge bg-light text-dark">{product.category}</span>
          {product.isCustomizable && (
            <span className="badge bg-primary ms-1">Customizable</span>
          )}
        </div>
        
        <h6 className="card-title">{product.name}</h5>
        <p className="card-text text-muted small flex-grow-1">
          {product.description?.substring(0, 60)}...
        </p>
        
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div>
            <h5 className="text-primary mb-0">₹{product.price}</h5>
            {product.originalPrice && (
              <small className="text-muted text-decoration-line-through">
                ₹{product.originalPrice}
              </small>
            )}
          </div>
          
          <div className="btn-group">
            <Link
              to={`/product/${product.id}`}
              className="btn btn-outline-primary btn-sm"
            >
              View
            </Link>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <i className="bi bi-cart-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
