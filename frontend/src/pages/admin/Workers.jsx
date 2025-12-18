import React from 'react';

const AdminWorkers = () => {
  const workers = [
    { id: 1, name: 'Tailor 1', role: 'Master Tailor', phone: '+91 9876543210', status: 'Active' },
    { id: 2, name: 'Tailor 2', role: 'Assistant Tailor', phone: '+91 9876543211', status: 'Active' },
    { id: 3, name: 'Tailor 3', role: 'Stitching Expert', phone: '+91 9876543212', status: 'On Leave' },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Worker Management</h1>
        <button className="btn btn-primary">
          <i className="bi bi-plus me-2"></i>Add Worker
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workers.map(worker => (
              <tr key={worker.id}>
                <td>{worker.id}</td>
                <td>{worker.name}</td>
                <td>{worker.role}</td>
                <td>{worker.phone}</td>
                <td>
                  <span className={`badge ${worker.status === 'Active' ? 'bg-success' : 'bg-warning'}`}>
                    {worker.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2">
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn btn-sm btn-outline-danger">
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminWorkers;
