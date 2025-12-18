import React from 'react';

const WorkerDashboard = () => {
  const tasks = [
    { id: 1, orderId: 'ORD-001', customer: 'John Doe', task: 'Shirt Stitching', dueDate: 'Dec 25, 2024', status: 'In Progress' },
    { id: 2, orderId: 'ORD-002', customer: 'Jane Smith', task: 'Suit Tailoring', dueDate: 'Dec 28, 2024', status: 'Pending' },
    { id: 3, orderId: 'ORD-003', customer: 'Bob Johnson', task: 'Pant Alteration', dueDate: 'Dec 22, 2024', status: 'Completed' },
  ];

  return (
    <div className="container py-4">
      <h1 className="mb-4">Worker Dashboard</h1>
      
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h2 className="text-primary">5</h2>
              <p className="text-muted">Total Tasks</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h2 className="text-success">3</h2>
              <p className="text-muted">Completed</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h2 className="text-warning">2</h2>
              <p className="text-muted">In Progress</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">My Tasks</h5>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Task</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id}>
                    <td>{task.orderId}</td>
                    <td>{task.customer}</td>
                    <td>{task.task}</td>
                    <td>{task.dueDate}</td>
                    <td>
                      <span className={`badge ${
                        task.status === 'Completed' ? 'bg-success' :
                        task.status === 'In Progress' ? 'bg-warning' : 'bg-secondary'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary">Update Status</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
