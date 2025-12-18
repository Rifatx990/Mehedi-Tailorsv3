import React from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="container py-4">
      <div className="alert alert-info">
        <strong>Note:</strong> This page redirects to the main Register page.
        <div className="mt-2">
          <Link to="/register" className="btn btn-primary">Go to Register</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
