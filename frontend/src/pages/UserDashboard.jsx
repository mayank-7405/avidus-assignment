import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null); 
  const navigate = useNavigate();

  // 🚨 YAHAN TERA RENDER KA LINK SET KAR DIYA HAI 🚨
  const API_URL = import.meta.env.VITE_API_URL || "https://avidus-assignment-1pjn.onrender.com";

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  useEffect(() => {
    if (!userInfo || userInfo.role === 'Admin') {
      navigate('/');
      return;
    }
    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      // 👈 Yahan API_URL lagaya
      const { data } = await axios.get(`${API_URL}/api/tasks`, config);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // 👈 Update Task API
        await axios.put(`${API_URL}/api/tasks/${editId}`, { title, description }, config);
        setEditId(null); 
      } else {
        // 👈 Create Task API
        await axios.post(`${API_URL}/api/tasks`, { title, description }, config);
      }
      setTitle(''); 
      setDescription('');
      fetchTasks(); 
    } catch (error) {
      alert("Error saving task");
    }
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setEditId(task._id); 
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        // 👈 Delete Task API
        await axios.delete(`${API_URL}/api/tasks/${id}`, config);
        fetchTasks();
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
      <nav className="navbar" style={{ backgroundColor: '#2980b9' }}>
        <h2>👤 Avidus User Workspace</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>
      
      <div className="dashboard-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Task Form */}
        <div className="task-form-box">
          <h3>{editId ? '✏️ Update Task' : '➕ Create New Task'}</h3>
          <form onSubmit={handleSubmit} className="task-form">
            <input 
              type="text" 
              placeholder="Task Title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
            <textarea 
              placeholder="Task Description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              rows="3"
            />
            <button type="submit" className="login-btn">
              {editId ? 'Update Task' : 'Add Task'}
            </button>
            {editId && (
              <button 
                type="button" 
                className="login-btn" 
                style={{ background: '#95a5a6', marginTop: '10px' }} 
                onClick={() => { setEditId(null); setTitle(''); setDescription(''); }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* Task List */}
        <div className="task-list">
          <h3>📋 My Tasks</h3>
          {tasks.length === 0 ? (
            <p style={{ marginTop: '10px', color: '#7f8c8d' }}>No tasks found. Create your first task above!</p>
          ) : (
            tasks.map(task => (
              <div key={task._id} className="task-card">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <div className="task-actions">
                  <button onClick={() => handleEdit(task)} className="action-btn toggle-btn">Edit</button>
                  <button onClick={() => handleDelete(task._id)} className="action-btn delete-btn">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;