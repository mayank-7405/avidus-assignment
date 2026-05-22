import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'Admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const { data: usersData } = await axios.get('/api/admin/users', config);
      const { data: tasksData } = await axios.get('/api/admin/tasks', config);
      const { data: logsData } = await axios.get('/api/admin/logs', config);
      setUsers(usersData);
      setTasks(tasksData);
      setLogs(logsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // User Actions
  const toggleUserStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await axios.patch(`/api/admin/users/${id}`, { status: newStatus }, config);
      fetchData(); // Data refresh karo
    } catch (error) {
      alert("Error updating status");
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/api/admin/users/${id}`, config);
        fetchData(); // Data refresh karo
      } catch (error) {
        alert("Error deleting user");
      }
    }
  };

  // Task Actions
  const deleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`/api/tasks/${id}`, config);
        fetchData();
      } catch (error) {
        alert("Error deleting task");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h2>👑 Avidus Admin Panel</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>

      <div className="dashboard-content">
        <div className="analytics-grid">
          <div className="card"><h3>Total Users</h3><p>{users.length}</p></div>
          <div className="card"><h3>Total Tasks</h3><p>{tasks.length}</p></div>
          <div className="card"><h3>Logs Recorded</h3><p>{logs.length}</p></div>
          <div className="card"><h3>Active Admins</h3><p>{users.filter(u => u.role === 'Admin').length}</p></div>
        </div>

        <div className="admin-tables-container">
          {/* Users Table */}
          <div className="table-box full-width">
            <h3>👥 Manage Users</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <span className={u.status === 'Active' ? 'status-green' : 'status-red'}>{u.status}</span>
                    </td>
                    <td>
                      <button className="action-btn toggle-btn" onClick={() => toggleUserStatus(u._id, u.status)}>
                        {u.status === 'Active' ? 'Block' : 'Unblock'}
                      </button>
                      <button className="action-btn delete-btn" onClick={() => deleteUser(u._id)} disabled={u.role === 'Admin'}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tasks Table */}
          <div className="table-box full-width" style={{ marginTop: '20px' }}>
            <h3>📋 All Tasks</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Creator</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(t => (
                  <tr key={t._id}>
                    <td>{t.title}</td>
                    <td>{t.user?.name || 'Unknown'}</td>
                    <td>{t.status || 'Pending'}</td>
                    <td>
                      <button className="action-btn delete-btn" onClick={() => deleteTask(t._id)}>Delete</button>
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
}

export default AdminDashboard;