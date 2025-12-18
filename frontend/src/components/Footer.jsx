import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="container py-5">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3">TailorCraft</h5>
            <p className="text-light">
              Premium custom tailoring and ready-made clothing solutions.
              Your perfect fit, crafted with care.
            </p>
          </div>
          
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light text-decoration-none">Home</Link></li>
              <li><Link to="/products" className="text-light text-decoration-none">Products</Link></li>
              <li><Link to="/dashboard" className="text-light text-decoration-none">Dashboard</Link></li>
            </ul>
          </div>
          
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold mb-3">Customer Service</h6>
            <ul className="list-unstyled">
              <li><a href="#contact" className="text-light text-decoration-none">Contact Us</a></li>
              <li><a href="#faq" className="text-light text-decoration-none">FAQ</a></li>
              <li><a href="#shipping" className="text-light text-decoration-none">Shipping Policy</a></li>
              <li><a href="#returns" className="text-light text-decoration-none">Returns & Exchanges</a></li>
            </ul>
          </div>
          
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold mb-3">Contact Info</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="bi bi-geo-alt me-2"></i>
                123 Fashion Street, City
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone me-2"></i>
                +1 234 567 8900
              </li>
              <li>
                <i className="bi bi-envelope me-2"></i>
                info@tailorcraft.com
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="bg-light my-4" />
        
        <div className="row">
          <div className="col-md-6">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} TailorCraft. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-end">
            <div className="d-inline-block ms-3">
              <a href="#facebook" className="text-light me-3">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#instagram" className="text-light me-3">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#twitter" className="text-light">
                <i className="bi bi-twitter"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
