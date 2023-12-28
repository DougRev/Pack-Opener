import React from 'react';
import CardManager from './CardManager';
import PackManager from './PackManager';
import FileUpload from './FileUpload'; // Import the FileUpload component
import ManageTemplates from './ManageTemplates'; // Import the ManageTemplates component
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-dashboard-title">Admin Dashboard</h1>
      <div className="admin-dashboard-section">
        <FileUpload /> {/* Add the FileUpload component */}
      </div>
      <div className="admin-dashboard-section">
        <CardManager />
      </div>
      <div className="admin-dashboard-section">
        <PackManager />
      </div>
      <div className="admin-dashboard-section">
        <ManageTemplates /> {/* Add the ManageTemplates component */}
      </div>
    </div>
  );
};

export default AdminDashboard;
