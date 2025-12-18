import React from 'react';

const AdminOrders = () => {
  const orders = [
    { id: 1, orderNumber: 'ORD-001', customer: 'John Doe', amount: '₹8,500', status: 'Delivered' },
    { id: 2, orderNumber: 'ORD-002', customer: 'Jane Smith', amount: '₹2,500', status: 'Processing' },
    { id: 3, orderNumber: 'ORD-003', customer: 'Bob Johnson', amount: '₹5,000', status: 'Shipped' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'success';
      case 'Processing': return 'warning';
      case 'Shipped': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Order Management</h1>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>{order.customer}</td>
                <td>{order.amount}</td>
                <td>
                  <span className={`badge bg-${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
