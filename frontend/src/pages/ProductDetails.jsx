import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import { productService } from '../services/productService';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist } = useCart();
  
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customization, setCustomization] = useState({
    size: '',
    color: '',
    fabric: '',
    measurements: {},
    deliveryDate: '',
    advancePaid: 0,
    isCustom: false
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const data = await productService.getProductById(id);
      setProduct(data);
      if (data.variants && data.variants.length > 0) {
        setSelectedVariant(data.variants[0]);
        setCustomization(prev => ({
          ...prev,
          size: data.variants[0].size,
          color: data.variants[0].color,
          fabric: data.variants[0].fabric
        }));
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setCustomization(prev => ({
      ...prev,
      size: variant.size,
      color: variant.color,
      fabric: variant.fabric
    }));
  };

  const handleAddToCart = () => {
    if (product.isCustomizable && showCustomForm) {
      // Add custom product with measurements
      addToCart(product, {
        ...customization,
        isCustom: true,
        customPrice: product.customPrice || product.price * 1.2 // 20% premium for custom
      });
    } else {
      // Add regular product
      addToCart(product, {
        size: selectedVariant?.size,
        color: selectedVariant?.color,
        fabric: selectedVariant?.fabric
      });
    }
    
    navigate('/cart');
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
    setIsWishlisted(!isWishlisted);
  };

  if (loading) return <Loader />;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container py-5">
      <div className="row">
        {/* Product Images */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm">
            <img
              src={product.image || '/api/placeholder/600/600'}
              className="card-img-top"
              alt={product.name}
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
            <div className="row g-2 mt-2">
              {[1, 2, 3, 4].map((img, index) => (
                <div className="col-3" key={index}>
                  <img
                    src={`/api/placeholder/200/200?text=Image+${index + 1}`}
                    className="img-fluid rounded cursor-pointer"
                    alt={`${product.name} view ${index + 1}`}
                    style={{ height: '80px', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="col-lg-6">
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href={`/products?category=${product.category}`}>
                  {product.category}
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>

          <h1 className="h2 mb-3">{product.name}</h1>
          
          <div className="d-flex align-items-center mb-3">
            <div className="text-warning me-2">
              {'★'.repeat(4)}<span className="text-muted">★</span>
            </div>
            <span className="text-muted">(24 reviews)</span>
          </div>

          <div className="mb-4">
            <h2 className="text-primary mb-0">
              {product.isCustomizable && showCustomForm 
                ? `₹${(product.customPrice || product.price * 1.2).toFixed(2)}`
                : `₹${product.price}`
              }
            </h2>
            {product.originalPrice && (
              <del className="text-muted">₹{product.originalPrice}</del>
            )}
            {product.discount && (
              <span className="badge bg-success ms-2">{product.discount}% OFF</span>
            )}
          </div>

          <p className="mb-4">{product.description}</p>

          {/* Size Selection */}
          {product.variants && product.variants.some(v => v.size) && (
            <div className="mb-4">
              <h6 className="mb-3">Size</h6>
              <div className="d-flex flex-wrap gap-2">
                {[...new Set(product.variants.map(v => v.size))].map(size => (
                  <button
                    key={size}
                    className={`btn ${customization.size === size ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => handleVariantSelect(product.variants.find(v => v.size === size))}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.variants && product.variants.some(v => v.color) && (
            <div className="mb-4">
              <h6 className="mb-3">Color</h6>
              <div className="d-flex flex-wrap gap-2">
                {[...new Set(product.variants.map(v => v.color))].map(color => (
                  <button
                    key={color}
                    className={`btn ${customization.color === color ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => handleVariantSelect(product.variants.find(v => v.color === color))}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fabric Selection */}
          {product.variants && product.variants.some(v => v.fabric) && (
            <div className="mb-4">
              <h6 className="mb-3">Fabric</h6>
              <div className="d-flex flex-wrap gap-2">
                {[...new Set(product.variants.map(v => v.fabric))].map(fabric => (
                  <button
                    key={fabric}
                    className={`btn ${customization.fabric === fabric ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => handleVariantSelect(product.variants.find(v => v.fabric === fabric))}
                  >
                    {fabric}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-4">
            <h6 className="mb-3">Quantity</h6>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input
                type="number"
                className="form-control text-center mx-2"
                style={{ width: '80px' }}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Custom Tailoring Option */}
          {product.isCustomizable && (
            <div className="mb-4">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="customSwitch"
                  checked={showCustomForm}
                  onChange={(e) => setShowCustomForm(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="customSwitch">
                  <strong>Custom Tailoring</strong> (20% premium)
                </label>
              </div>
              
              {showCustomForm && (
                <div className="card mt-3">
                  <div className="card-body">
                    <h6 className="card-title mb-3">Customization Details</h6>
                    
                    <div className="mb-3">
                      <label className="form-label">Upload Design (Optional)</label>
                      <input type="file" className="form-control" accept="image/*" />
                      <small className="text-muted">Upload reference images for your custom design</small>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Special Instructions</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Any special requirements or instructions..."
                      ></textarea>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Delivery Date</label>
                      <input
                        type="date"
                        className="form-control"
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setCustomization(prev => ({ 
                          ...prev, 
                          deliveryDate: e.target.value 
                        }))}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Advance Payment</label>
                      <select
                        className="form-select"
                        onChange={(e) => setCustomization(prev => ({ 
                          ...prev, 
                          advancePaid: parseInt(e.target.value) 
                        }))}
                      >
                        <option value="0">None</option>
                        <option value="50">50% Advance</option>
                        <option value="100">Full Payment</option>
                      </select>
                    </div>
                    
                    <button 
                      className="btn btn-outline-primary w-100"
                      onClick={() => navigate('/measurements')}
                    >
                      <i className="bi bi-rulers me-2"></i>
                      Add/Select Measurements
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="d-flex gap-3 mb-4">
            <button
              className="btn btn-primary flex-grow-1"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <i className="bi bi-cart-plus me-2"></i>
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            
            <button
              className={`btn ${isWishlisted ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={handleWishlistToggle}
            >
              <i className={`bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}`}></i>
            </button>
          </div>

          {/* Product Details */}
          <div className="card">
            <div className="card-body">
              <h6 className="card-title mb-3">Product Details</h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <strong>Category:</strong> {product.category}
                </li>
                <li className="mb-2">
                  <strong>Material:</strong> {product.material || 'Premium Cotton'}
                </li>
                <li className="mb-2">
                  <strong>Care Instructions:</strong> Machine wash cold
                </li>
                <li className="mb-0">
                  <strong>Stock:</strong> {product.stock} units available
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
