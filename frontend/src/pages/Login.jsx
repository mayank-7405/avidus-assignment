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
    setError(''); // Puraane errors hatao

    try {
      // Backend ke login raste par request bhej rahe hain
      const response = await axios.post('/api/auth/login', { email, password });
      
      // Agar login success hua toh token aur user data save kar lo
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      
      // Role ke hisaab se dashboard par bhejo (Role-Based UI logic)
      if (response.data.role === 'Admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
      
    } catch (err) {
      // Agar email/password galat hua toh red color mein error dikhega
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
