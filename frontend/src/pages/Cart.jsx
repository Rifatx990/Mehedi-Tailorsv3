import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <i className="bi bi-cart display-1 text-muted mb-3"></i>
          <h3>Your cart is empty</h3>
          <p className="text-muted mb-4">Add some products to your cart</p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="h2 mb-4">Shopping Cart</h1>
      
      <div className="row">
        {/* Cart Items */}
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              {cart.map((item) => (
                <div key={item.id} className="row align-items-center mb-4 pb-4 border-bottom">
                  <div className="col-md-2">
                    <img
                      src={item.image || '/api/placeholder/100/100'}
                      className="img-fluid rounded"
                      alt={item.name}
                      style={{ height: '80px', objectFit: 'cover' }}
                    />
                  </div>
                  
                  <div className="col-md-4">
                    <h6 className="mb-1">{item.name}</h6>
                    <small className="text-muted d-block">
                      {item.size && `Size: ${item.size}`}
                      {item.color && ` | Color: ${item.color}`}
                      {item.fabric && ` | Fabric: ${item.fabric}`}
                      {item.isCustom && ' | Custom Tailoring'}
                    </small>
                    {item.isCustom && (
                      <small className="text-success d-block">
                        <i className="bi bi-rulers me-1"></i>
                        Custom measurements applied
                      </small>
                    )}
                  </div>
                  
                  <div className="col-md-3">
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="form-control form-control-sm text-center mx-2"
                        style={{ width: '60px' }}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        min="1"
                      />
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-md-2 text-end">
                    <h6 className="mb-0">₹{item.price * item.quantity}</h6>
                    <small className="text-muted">₹{item.price} each</small>
                  </div>
                  
                  <div className="col-md-1 text-end">
                    <button
                      className="btn btn-link text-danger"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="d-flex justify-content-between">
            <Link to="/products" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-2"></i>
              Continue Shopping
            </Link>
            <button
              className="btn btn-outline-danger"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your cart?')) {
                  // Clear cart logic would go here
                  console.log('Clear cart');
                }
              }}
            >
              Clear Cart
            </button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal</span>
                <span>₹{getCartTotal()}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              
              <div className="input-group mb-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Coupon code"
                />
                <button className="btn btn-outline-primary" type="button">
                  Apply
                </button>
              </div>
              
              <div className="d-flex justify-content-between mb-3 border-top pt-3">
                <strong>Total</strong>
                <strong>₹{getCartTotal()}</strong>
              </div>
              
              <button
                className="btn btn-primary w-100 mb-3"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
              
              <div className="alert alert-info small">
                <i className="bi bi-info-circle me-2"></i>
                Free shipping on orders above ₹2000. 7-day return policy.
              </div>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="card shadow-sm mt-4">
            <div className="card-body">
              <h6 className="mb-3">We Accept</h6>
              <div className="d-flex gap-2">
                <div className="bg-light rounded p-2">
                  <i className="bi bi-credit-card text-muted"></i>
                  <small className="d-block">Cards</small>
                </div>
                <div className="bg-light rounded p-2">
                  <i className="bi bi-bank text-muted"></i>
                  <small className="d-block">UPI</small>
                </div>
                <div className="bg-light rounded p-2">
                  <i className="bi bi-cash text-muted"></i>
                  <small className="d-block">Cash</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
