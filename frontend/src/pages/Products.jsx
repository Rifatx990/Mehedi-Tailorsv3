import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { productService } from '../services/productService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    size: '',
    color: '',
    fabric: '',
    sort: 'newest'
  });
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setFilters(prev => ({ ...prev, ...params }));
    fetchProducts(params);
    fetchFilters();
  }, [searchParams]);

  const fetchProducts = async (params) => {
    setLoading(true);
    try {
      const data = await productService.getProducts(params);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const data = await productService.getFilters();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Remove empty filters
    const params = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== '')
    );
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      size: '',
      color: '',
      fabric: '',
      sort: 'newest'
    });
    setSearchParams({});
  };

  return (
    <div className="container py-5">
      <div className="row">
        {/* Filters Sidebar */}
        <div className="col-lg-3 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Filters</h5>
            </div>
            <div className="card-body">
              
              {/* Category Filter */}
              <div className="mb-4">
                <h6 className="mb-3">Category</h6>
                <div className="list-group list-group-flush">
                  <button
                    className={`list-group-item list-group-item-action border-0 px-0 ${!filters.category ? 'active' : ''}`}
                    onClick={() => handleFilterChange('category', '')}
                  >
                    All Categories
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`list-group-item list-group-item-action border-0 px-0 ${filters.category === category.slug ? 'active' : ''}`}
                      onClick={() => handleFilterChange('category', category.slug)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-4">
                <h6 className="mb-3">Price Range</h6>
                <div className="row g-2">
                  <div className="col">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-4">
                <h6 className="mb-3">Size</h6>
                <div className="d-flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button
                      key={size}
                      className={`btn btn-sm ${filters.size === size ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => handleFilterChange('size', size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="mb-4">
                <h6 className="mb-3">Color</h6>
                <div className="d-flex flex-wrap gap-2">
                  {['Black', 'White', 'Blue', 'Red', 'Green', 'Gray'].map(color => (
                    <button
                      key={color}
                      className={`btn btn-sm ${filters.color === color ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => handleFilterChange('color', color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn btn-outline-danger w-100" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Products</h1>
            <div className="d-flex align-items-center">
              <span className="me-2">Sort by:</span>
              <select
                className="form-select form-select-sm w-auto"
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : products.length > 0 ? (
            <>
              <div className="row g-4">
                {products.map(product => (
                  <div className="col-md-4 col-sm-6" key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              <nav className="mt-5">
                <ul className="pagination justify-content-center">
                  <li className="page-item disabled">
                    <button className="page-link">Previous</button>
                  </li>
                  <li className="page-item active">
                    <button className="page-link">1</button>
                  </li>
                  <li className="page-item">
                    <button className="page-link">2</button>
                  </li>
                  <li className="page-item">
                    <button className="page-link">3</button>
                  </li>
                  <li className="page-item">
                    <button className="page-link">Next</button>
                  </li>
                </ul>
              </nav>
            </>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-search display-1 text-muted mb-3"></i>
              <h3>No products found</h3>
              <p className="text-muted">Try adjusting your filters or search term</p>
              <button className="btn btn-primary" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
