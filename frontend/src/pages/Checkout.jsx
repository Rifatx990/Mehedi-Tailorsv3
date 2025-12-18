import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [orderNotes, setOrderNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          customization: item.isCustom ? {
            size: item.size,
            color: item.color,
            fabric: item.fabric,
            measurements: item.measurements,
            deliveryDate: item.deliveryDate
          } : null
        })),
        shippingAddress,
        paymentMethod,
        couponCode: couponCode || undefined,
        notes: orderNotes,
        total: getCartTotal() - discount,
        advance: cart.some(item => item.advancePaid > 0) 
          ? getCartTotal() * 0.5 
          : 0,
        due: cart.some(item => item.advancePaid > 0)
          ? getCartTotal() * 0.5
          : getCartTotal() - discount
      };

      const response = await orderService.createOrder(orderData);
      clearCart();
      
      // Redirect to success page or dashboard
      navigate('/dashboard?order=success');
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode) return;
    
    try {
      const response = await orderService.applyCoupon(couponCode);
      if (response.valid) {
        setDiscount(response.discount);
        alert(`Coupon applied! You saved ₹${response.discount}`);
      }
    } catch (error) {
      alert('Invalid coupon code');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Checkout Steps */}
          <div className="mb-5">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-center">
                <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${step >= 1 ? 'bg-primary text-white' : 'bg-light'} mb-2`}
                  style={{ width: '40px', height: '40px' }}>
                  1
                </div>
                <div>Shipping</div>
              </div>
              <div className="flex-grow-1 border-top mx-3"></div>
              <div className="text-center">
                <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${step >= 2 ? 'bg-primary text-white' : 'bg-light'} mb-2`}
                  style={{ width: '40px', height: '40px' }}>
                  2
                </div>
                <div>Payment</div>
              </div>
              <div className="flex-grow-1 border-top mx-3"></div>
              <div className="text-center">
                <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${step >= 3 ? 'bg-primary text-white' : 'bg-light'} mb-2`}
                  style={{ width: '40px', height: '40px' }}>
                  3
                </div>
                <div>Confirmation</div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Left Column - Forms */}
            <div className="col-lg-8 mb-4">
              {step === 1 && (
                <div className="card shadow-sm">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">Shipping Address</h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleAddressSubmit}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Full Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            required
                            value={shippingAddress.fullName}
                            onChange={(e) => setShippingAddress(prev => ({ ...prev, fullName: e.target.value }))}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email *</label>
                          <input
                            type="email"
                            className="form-control"
                            required
                            value={shippingAddress.email}
                            onChange={(e) => setShippingAddress(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Phone *</label>
                          <input
                            type="tel"
                            className="form-control"
                            required
                            value={shippingAddress.phone}
                            onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">City *</label>
                          <input
                            type="text"
                            className="form-control"
                            required
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Address *</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            required
                            value={shippingAddress.address}
                            onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">State *</label>
                          <input
                            type="text"
                            className="form-control"
                            required
                            value={shippingAddress.state}
                            onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">ZIP Code *</label>
                          <input
                            type="text"
                            className="form-control"
                            required
                            value={shippingAddress.zipCode}
                            onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label className="form-label">Order Notes (Optional)</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Special instructions for delivery, customization details, etc."
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                        />
                      </div>
                      
                      <button type="submit" className="btn btn-primary mt-4">
                        Continue to Payment
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="card shadow-sm">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">Payment Method</h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handlePaymentSubmit}>
                      <div className="mb-4">
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            id="cod"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                          <label className="form-check-label d-flex align-items-center" htmlFor="cod">
                            <i className="bi bi-cash-coin fs-4 me-3"></i>
                            <div>
                              <strong>Cash on Delivery</strong>
                              <p className="text-muted mb-0 small">Pay when you receive the order</p>
                            </div>
                          </label>
                        </div>
                        
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            id="card"
                            value="card"
                            checked={paymentMethod === 'card'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                          <label className="form-check-label d-flex align-items-center" htmlFor="card">
                            <i className="bi bi-credit-card fs-4 me-3"></i>
                            <div>
                              <strong>Credit/Debit Card</strong>
                              <p className="text-muted mb-0 small">Secure card payment</p>
                            </div>
                          </label>
                        </div>
                        
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="paymentMethod"
                            id="upi"
                            value="upi"
                            checked={paymentMethod === 'upi'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                          <label className="form-check-label d-flex align-items-center" htmlFor="upi">
                            <i className="bi bi-phone fs-4 me-3"></i>
                            <div>
                              <strong>UPI</strong>
                              <p className="text-muted mb-0 small">Google Pay, PhonePe, etc.</p>
                            </div>
                          </label>
                        </div>
                      </div>
                      
                      {paymentMethod === 'card' && (
                        <div className="card bg-light border mb-4">
                          <div className="card-body">
                            <div className="mb-3">
                              <label className="form-label">Card Number</label>
                              <input type="text" className="form-control" placeholder="1234 5678 9012 3456" />
                            </div>
                            <div className="row g-3">
                              <div className="col-md-6">
                                <label className="form-label">Expiry Date</label>
                                <input type="text" className="form-control" placeholder="MM/YY" />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label">CVV</label>
                                <input type="text" className="form-control" placeholder="123" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="d-flex justify-content-between mt-4">
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => setStep(1)}
                        >
                          Back to Shipping
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Processing...
                            </>
                          ) : (
                            'Place Order'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="col-lg-4">
              <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
                <div className="card-header bg-white">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    {cart.map((item) => (
                      <div key={item.id} className="d-flex justify-content-between mb-2">
                        <div>
                          <small>{item.name} × {item.quantity}</small>
                          {item.isCustom && (
                            <small className="d-block text-success">
                              <i className="bi bi-rulers me-1"></i>Custom
                            </small>
                          )}
                        </div>
                        <small>₹{item.price * item.quantity}</small>
                      </div>
                    ))}
                  </div>
                  
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button 
                      className="btn btn-outline-primary" 
                      type="button"
                      onClick={applyCoupon}
                    >
                      Apply
                    </button>
                  </div>
                  
                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal</span>
                      <span>₹{getCartTotal()}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Shipping</span>
                      <span className="text-success">Free</span>
                    </div>
                    {discount > 0 && (
                      <div className="d-flex justify-content-between mb-2 text-success">
                        <span>Discount</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}
                    <div className="d-flex justify-content-between mb-2 border-top pt-2">
                      <strong>Total</strong>
                      <strong>₹{getCartTotal() - discount}</strong>
                    </div>
                    
                    {cart.some(item => item.isCustom) && (
                      <div className="alert alert-warning small mt-3">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Custom orders may take 7-14 days for delivery
                      </div>
                    )}
                    
                    {cart.some(item => item.advancePaid > 0) && (
                      <div className="alert alert-info small mt-2">
                        <i className="bi bi-info-circle me-2"></i>
                        50% advance payment required for custom orders
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
