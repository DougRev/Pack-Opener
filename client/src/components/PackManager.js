import React, { useState, useEffect } from 'react';
import './PackManager.css'; // Make sure to create this CSS file

const PackManager = () => {
  const [packs, setPacks] = useState([]);
  const [editingPack, setEditingPack] = useState(null);
  const [packFormData, setPackFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    try {
      const response = await fetch('/api/packs', {
        headers: {
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      const data = await response.json();
      if (response.ok) {
        setPacks(data);
      } else {
        throw new Error(data.message || 'Failed to fetch packs.');
      }
    } catch (error) {
      console.error('Error fetching packs:', error);
      setError(error.message); // Set error message in state
    }
  };

  const handleFormChange = (e) => {
    setPackFormData({ ...packFormData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const method = editingPack ? 'PUT' : 'POST';
    const url = editingPack ? `/api/packs/${editingPack._id}` : '/api/packs';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packFormData),
      });

      const data = await response.json();
      if (response.ok) {
        fetchPacks();
        setEditingPack(null);
        setPackFormData({ name: '', description: '' });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error submitting pack:', error.message);
    }
  };

  const handleEdit = (pack) => {
    setEditingPack(pack);
    setPackFormData({ name: pack.name, description: pack.description });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/packs/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchPacks();
      } else {
        throw new Error('Error deleting pack');
      }
    } catch (error) {
      console.error('Error deleting pack:', error.message);
    }
  };

  return (
    <div className="pack-manager-container">
      <h2 className="pack-manager-header">Manage Packs</h2>
      {error && <p className="error">{error}</p>} {/* Display error message if it exists */}
      <form onSubmit={handleFormSubmit} className="pack-manager-form">
        {/* Form fields and submit button */}
      </form>
      <div className="pack-list">
        {packs.map(pack => (
          <div key={pack._id} className="pack-item">
            <div className="pack-item-header">
              <div className="pack-item-name">{pack.name}</div>
              <div className="pack-item-buttons">
                {/* Edit/Delete buttons */}
              </div>
            </div>
            <div className="pack-item-description">{pack.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackManager;
