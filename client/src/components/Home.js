import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = ({ onSelectPack, isAdmin }) => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    onSelectPack(null); // Reset selected pack if needed
    navigate('/packselection'); // Navigate to PackSelection route
  };

  const handleViewInventory = () => {
    navigate('/inventory'); // Navigate to Inventory route
  };

  const handleAdminDashboard = () => {
    isAdmin && navigate('/admin'); // Navigate to Admin Dashboard route only if isAdmin
  };

  return (
    <div className="home-container">
      <div className='home-content'>
      <h1>Welcome to the Ultimate Pack Opener!</h1>
      </div>
    </div>
  );
};

export default Home;
