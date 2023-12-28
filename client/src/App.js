import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import UserAuth from './components/UserAuth';
import Home from './components/Home';
import Navigation from './components/Navigation';
import PackSelection from './components/PackSelection';
import CardDisplay from './components/CardDisplay';
import Inventory from './components/Inventory';
import AdminDashboard from './components/AdminDashboard';
import CardManager from './components/CardManager';
import PackManager from './components/PackManager';

const RequireAuth = ({ children, loggedIn }) => {
  const location = useLocation();
  if (!loggedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
};

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  const [username, setUsername] = useState("");

  const handleLoginSuccess = (adminFlag, username) => {
    setIsAdmin(adminFlag);
    setLoggedIn(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setIsAdmin(false);
    setUsername("");
    // Add any other logout logic here if necessary, like clearing tokens
  };

  const handleSelectPack = (pack) => {
    setSelectedPack(pack);
  };

  return (
    <Router>
      <Navigation isAdmin={isAdmin} loggedIn={loggedIn} username={username} onLogout={handleLogout} />
      <Routes>
        <Route path="/auth" element={<UserAuth onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={
          <RequireAuth loggedIn={loggedIn}>
            <Home isAdmin={isAdmin} onSelectPack={handleSelectPack} />
          </RequireAuth>
        } />
        <Route path="/packselection" element={
          <RequireAuth loggedIn={loggedIn}>
            <PackSelection onPackSelect={handleSelectPack} />
          </RequireAuth>
        } />
        <Route path="/carddisplay" element={
          <RequireAuth loggedIn={loggedIn}>
            <CardDisplay pack={selectedPack} />
          </RequireAuth>
        } />
        <Route path="/inventory" element={
          <RequireAuth loggedIn={loggedIn}>
            <Inventory />
          </RequireAuth>
        } />
        <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" replace />} />
        <Route path="/admin/cards" element={isAdmin ? <CardManager /> : <Navigate to="/auth" replace />} />
        <Route path="/admin/packs" element={isAdmin ? <PackManager /> : <Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
