import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'; // Make sure this line is included
import { FaUser, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa'; // Import icons
import './UserAuth.css';


const UserAuth = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: registerUsername,
          password: registerPassword
        })
      });
      const data = await response.json();
      if (response.ok) {
        
        console.log('Registration successful:', data);
        setSuccessMessage('Registration successful!');

        // Clear the form fields
        setRegisterUsername('');
        setRegisterPassword('');
      } else {
        console.error('Registration failed:', data.message);
        setSuccessMessage('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token);
        const decodedToken = jwtDecode(data.token); // Use jwtDecode here
        console.log('Decoded Token:', decodedToken); // Log the decoded token to check the structure
  
        // Pass the isAdmin flag to the onLoginSuccess callback
        onLoginSuccess(decodedToken.isAdmin, decodedToken.username);
  
        setSuccessMessage('Login successful!');
        navigate('/home'); // Redirect to home page
      } else {
        console.error('Login failed:', data.message);
        setSuccessMessage('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  

  return (
    <div className="auth-container">
      <div className="auth-section">
        <h2>Register</h2>
        <form onSubmit={handleRegister} className="auth-form">
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit">
            <FaUserPlus className="icon" />
            Register
          </button>
        </form>
      </div>
      <div className="auth-section">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit">
            <FaSignInAlt className="icon" />
            Login
          </button>
        </form>
      </div>
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );  
};

export default UserAuth;
