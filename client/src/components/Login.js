import React, { useState } from 'react';
import './Login.css';
import jwt_decode from 'jwt-decode';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      console.log('Login Response:', data); // Check the response
  
      let decodedToken; // Declare decodedToken here
  
      if (data.token) {
        console.log("Token exists, setting in localStorage");
        localStorage.setItem('token', data.token);
  
        try {
          decodedToken = jwt_decode(data.token);
          console.log('Decoded Token:', decodedToken);
          localStorage.setItem('loginResponse', JSON.stringify(data));
          localStorage.setItem('decodedToken', JSON.stringify(decodedToken));
        } catch (decodeError) {
          console.error('Error decoding token:', decodeError);
        }
  
        if (decodedToken && decodedToken.isAdmin !== undefined) {
          onLoginSuccess(decodedToken.isAdmin);
        } else {
          // Default to false if isAdmin is not part of the token
          onLoginSuccess(false);
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Login error: ' + error.message);
    }
  };
  

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
