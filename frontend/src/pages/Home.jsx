import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { productService } from '../services/productService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // In a real app, you would have separate endpoints for featured/new products
      const [featured, newProds, cats] = await Promise.all([
        productService.getProducts({ featured: true, limit: 8 }),
        productService.getProducts({ sort: 'newest', limit: 8 }),
        productService.getCategories()
      ]);
      
      setFeaturedProducts(featured);
      setNewProducts(newProds);
      setCategories(cats.slice(0, 6));
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      {/* Hero Slider */}
      <section className="hero-slider mb-5">
        <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="container">
                <div className="row align-items-center min-vh-50">
                  <div className="col-md-6">
                    <h1 className="display-4 fw-bold mb-3">
                      Perfect Fit,<br />Every Time
                    </h1>
                    <p className="lead mb-4">
                      Custom tailored clothing made just for you. Experience the difference of perfect fit.
                    </p>
                    <Link to="/products" className="btn btn-primary btn-lg">
                      Shop Now
                    </Link>
                    <Link to="#custom" className="btn btn-outline-primary btn-lg ms-2">
                      Custom Order
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <img
                      src="/api/placeholder/600/400"
                      className="img-fluid rounded shadow"
                      alt="Tailoring"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="categories mb-5">
        <div className="container">
          <h2 className="text-center mb-4">Shop by Category</h2>
          <div className="row g-3">
            {categories.map((category) => (
              <div className="col-md-4 col-lg-2" key={category.id}>
                <Link 
                  to={`/products?category=${category.slug}`}
                  className="text-decoration-none"
                >
                  <div className="card border-0 shadow-sm text-center h-100 hover-shadow">
                    <div className="card-body">
                      <div className="mb-3">
                        <div className="bg-light rounded-circle p-3 d-inline-block">
                          <i className="bi bi-tshirt fs-3"></i>
                        </div>
                      </div>
                      <h6 className="card-title mb-0">{category.name}</h6>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products mb-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Featured Products</h2>
            <Link to="/products" className="btn btn-link">
              View All <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="row g-4">
            {featuredProducts.map((product) => (
              <div className="col-md-3" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="new-arrivals mb-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">New Arrivals</h2>
            <Link to="/products?sort=newest" className="btn btn-link">
              View All <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          <div className="row g-4">
            {newProducts.map((product) => (
              <div className="col-md-3" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Tailoring CTA */}
      <section className="custom-tailoring bg-light py-5 mb-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <img
                src="/api/placeholder/500/300"
                className="img-fluid rounded shadow"
                alt="Custom Tailoring"
              />
            </div>
            <div className="col-md-6">
              <h2 className="mb-3">Custom Tailoring Service</h2>
              <p className="mb-4">
                Get clothing tailored exactly to your measurements. Upload your design or 
                customize existing patterns. Perfect fit guaranteed.
              </p>
              <div className="row mb-4">
                <div className="col-6 mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle p-2 me-3">
                      <i className="bi bi-rulers"></i>
                    </div>
                    <div>
                      <h6 className="mb-0">Precise Measurements</h6>
                      <small className="text-muted">Save your measurements</small>
                    </div>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle p-2 me-3">
                      <i className="bi bi-upload"></i>
                    </div>
                    <div>
                      <h6 className="mb-0">Upload Design</h6>
                      <small className="text-muted">Your design, our craft</small>
                    </div>
                  </div>
                </div>
              </div>
              <Link to="#custom" className="btn btn-primary btn-lg">
                Start Custom Order
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
