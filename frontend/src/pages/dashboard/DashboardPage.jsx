import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <div className="container py-4">
      <div className="alert alert-info">
        <strong>Note:</strong> This page redirects to the main Customer Dashboard.
        <div className="mt-2">
          <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
