import React from 'react';
import { useNavigate } from 'react-router-dom';
import CurrencyDisplay from './CurrencyDisplay'; 

import './Navigation.css';

const Navigation = ({ isAdmin, loggedIn, username, onLogout }) => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <nav className="navigation">
      {loggedIn ? (
        <>
          <ul>
            <li onClick={() => navigateTo('/')}>Home</li>
            <li onClick={() => navigateTo('/packselection')}>Open Packs</li>
            <li onClick={() => navigateTo('/inventory')}>View Inventory</li>
            {isAdmin && <li onClick={() => navigateTo('/admin')}>Admin Dashboard</li>}
          </ul>
          <div className="nav-right">
            <CurrencyDisplay /> {/* Display currency for logged-in users */}
            <span>Welcome, {username}</span>
            <li onClick={onLogout}>Logout</li>
          </div>
        </>
      ) : (
        <ul>
          <li onClick={() => navigateTo('/auth')}>Login</li>
        </ul>
      )}
    </nav>
  );
};

export default Navigation;
