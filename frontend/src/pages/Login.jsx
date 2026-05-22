import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 

    // Yahan maine sirf ye ek line dynamic banayi hai
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      // Yahan ab `${API_URL}` use ho raha hai
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      
      if (response.data.role === 'Admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Avidus Interactive Login</h2>
        
        {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;