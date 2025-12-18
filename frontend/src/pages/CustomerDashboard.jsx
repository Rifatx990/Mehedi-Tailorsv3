import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import Loader from '../components/Loader';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
    dueBalance: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersData, measurementsData] = await Promise.all([
        orderService.getOrders(),
        // Add measurement service call here
        Promise.resolve([]) // Placeholder
      ]);

      setOrders(ordersData);
      setMeasurements(measurementsData);

      // Calculate stats
      const totalOrders = ordersData.length;
      const pendingOrders = ordersData.filter(o => o.status === 'pending' || o.status === 'processing').length;
      const completedOrders = ordersData.filter(o => o.status === 'completed').length;
      const totalSpent = ordersData.reduce((sum, order) => sum + order.total, 0);
      const dueBalance = ordersData.reduce((sum, order) => sum + (order.due || 0), 0);

      setStats({
        totalOrders,
        pendingOrders,
        completedOrders,
        totalSpent,
        dueBalance
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const invoiceBlob = await orderService.getInvoice(orderId);
      const url = window.URL.createObjectURL(invoiceBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container py-5">
      {/* Welcome Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h2 className="card-title">Welcome back, {user?.name}!</h2>
                  <p className="card-text mb-0">
                    Here's what's happening with your orders and account.
                  </p>
                </div>
                <div className="col-md-4 text-end">
                  <button className="btn btn-light" onClick={logout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-5">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Total Orders</h6>
                  <h3 className="mb-0">{stats.totalOrders}</h3>
                </div>
                <div className="bg-primary text-white rounded-circle p-3">
                  <i className="bi bi-bag"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Pending Orders</h6>
                  <h3 className="mb-0">{stats.pendingOrders}</h3>
                </div>
                <div className="bg-warning text-white rounded-circle p-3">
                  <i className="bi bi-clock"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Total Spent</h6>
                  <h3 className="mb-0">₹{stats.totalSpent}</h3>
                </div>
                <div className="bg-success text-white rounded-circle p-3">
                  <i className="bi bi-currency-rupee"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Due Balance</h6>
                  <h3 className="mb-0">₹{stats.dueBalance}</h3>
                </div>
                <div className="bg-danger text-white rounded-circle p-3">
                  <i className="bi bi-cash-coin"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white border-0">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                  >
                    <i className="bi bi-bag me-2"></i>
                    My Orders
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'measurements' ? 'active' : ''}`}
                    onClick={() => setActiveTab('measurements')}
                  >
                    <i className="bi bi-rulers me-2"></i>
                    Measurements
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <i className="bi bi-person me-2"></i>
                    Profile
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'addresses' ? 'active' : ''}`}
                    onClick={() => setActiveTab('addresses')}
                  >
                    <i className="bi bi-geo-alt me-2"></i>
                    Addresses
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="card-body">
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  {orders.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="bi bi-bag display-1 text-muted mb-3"></i>
                      <h5>No orders yet</h5>
                      <p className="text-muted">Start shopping to see your orders here</p>
                      <a href="/products" className="btn btn-primary">
                        Shop Now
                      </a>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Advance</th>
                            <th>Due</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.id}>
                              <td>
                                <strong>#{order.id.substring(0, 8)}</strong>
                              </td>
                              <td>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td>{order.items?.length || 0} items</td>
                              <td>₹{order.total}</td>
                              <td>₹{order.advance || 0}</td>
                              <td>
                                <span className={`badge ${order.due > 0 ? 'bg-warning' : 'bg-success'}`}>
                                  ₹{order.due || 0}
                                </span>
                              </td>
                              <td>
                                <span className={`badge bg-${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td>
                                <div className="btn-group btn-group-sm">
                                  <button
                                    className="btn btn-outline-primary"
                                    onClick={() => {/* View order details */}}
                                  >
                                    View
                                  </button>
                                  <button
                                    className="btn btn-outline-success"
                                    onClick={() => handleDownloadInvoice(order.id)}
                                  >
                                    <i className="bi bi-download"></i>
                                  </button>
                                  {order.status === 'pending' && (
                                    <button
                                      className="btn btn-outline-danger"
                                      onClick={() => {/* Cancel order */}}
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Measurements Tab */}
              {activeTab === 'measurements' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Saved Measurements</h5>
                    <button className="btn btn-primary">
                      <i className="bi bi-plus-circle me-2"></i>
                      Add New Measurements
                    </button>
                  </div>
                  
                  {measurements.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="bi bi-rulers display-1 text-muted mb-3"></i>
                      <h5>No measurements saved</h5>
                      <p className="text-muted">Save your measurements for faster custom orders</p>
                      <button className="btn btn-primary">
                        Add Measurements
                      </button>
                    </div>
                  ) : (
                    <div className="row g-4">
                      {measurements.map((measurement) => (
                        <div className="col-md-6" key={measurement.id}>
                          <div className="card">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                  <h6 className="card-title mb-1">{measurement.type}</h6>
                                  <small className="text-muted">
                                    Created: {new Date(measurement.createdAt).toLocaleDateString()}
                                  </small>
                                </div>
                                <div className="dropdown">
                                  <button
                                    className="btn btn-link text-muted"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="bi bi-three-dots-vertical"></i>
                                  </button>
                                  <ul className="dropdown-menu">
                                    <li>
                                      <button className="dropdown-item">
                                        <i className="bi bi-pencil me-2"></i>
                                        Edit
                                      </button>
                                    </li>
                                    <li>
                                      <button className="dropdown-item">
                                        <i className="bi bi-trash me-2"></i>
                                        Delete
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              
                              <div className="row g-2">
                                {Object.entries(measurement.data || {}).map(([key, value]) => (
                                  <div className="col-6" key={key}>
                                    <div className="bg-light rounded p-2">
                                      <small className="text-muted d-block">{key}</small>
                                      <strong>{value}"</strong>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <button className="btn btn-outline-primary w-100 mt-3">
                                Use for New Order
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <form>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={user?.name}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          defaultValue={user?.email}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Phone</label>
                        <input
                          type="tel"
                          className="form-control"
                          defaultValue="+91 9876543210"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Date of Birth</label>
                        <input type="date" className="form-control" />
                      </div>
                      <div className="col-12">
                        <button type="submit" className="btn btn-primary">
                          Update Profile
                        </button>
                      </div>
                    </div>
                  </form>
                  
                  <hr className="my-4" />
                  
                  <h6 className="mb-3">Change Password</h6>
                  <form>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label">Current Password</label>
                        <input type="password" className="form-control" />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">New Password</label>
                        <input type="password" className="form-control" />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Confirm New Password</label>
                        <input type="password" className="form-control" />
                      </div>
                      <div className="col-12">
                        <button type="submit" className="btn btn-primary">
                          Change Password
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Saved Addresses</h5>
                    <button className="btn btn-primary">
                      <i className="bi bi-plus-circle me-2"></i>
                      Add New Address
                    </button>
                  </div>
                  
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="card border-primary">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <span className="badge bg-primary">Default</span>
                              <h6 className="card-title mt-2 mb-1">Home</h6>
                            </div>
                            <div className="dropdown">
                              <button
                                className="btn btn-link text-muted"
                                type="button"
                                data-bs-toggle="dropdown"
                              >
                                <i className="bi bi-three-dots-vertical"></i>
                              </button>
                              <ul className="dropdown-menu">
          
