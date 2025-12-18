import React from 'react';

const AdminCustomers = () => {
  const customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210', orders: 5 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+91 9876543211', orders: 2 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '+91 9876543212', orders: 8 },
  ];

  return (
    <div className="container py-4">
      <h1 className="mb-4">Customer Management</h1>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Orders</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.orders}</td>
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

export default AdminCustomers;
