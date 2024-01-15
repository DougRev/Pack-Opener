import React, { useState, useEffect } from 'react';
import './PackManager.css'; // Make sure to create this CSS file

const PackManager = () => {
  const [packs, setPacks] = useState([]);
  const [editingPack, setEditingPack] = useState(null);
  const [rarityTemplates, setRarityTemplates] = useState([]); // Holds the rarity templates
  const [packFormData, setPackFormData] = useState({
    
    name: '',
    description: '',
    imageUrl: '',
    rarityDistributionTemplate: '', // Add this line
    rarityDistribution: {
      Common: 0,
      Uncommon: 0,
      Rare: 0,
      Epic: 0,
      Legendary: 0
    }
  });  const [error, setError] = useState('');

  useEffect(() => {
    fetchRarityTemplates();
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

  const fetchRarityTemplates = async () => {
    const token = localStorage.getItem('token'); 
    try {
      const response = await fetch('/api/rarity-distributions', {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });      
      const data = await response.json();
      if (response.ok) {
        setRarityTemplates(data);
      } else {
        throw new Error(data.message || 'Failed to fetch rarity templates.');
      }
    } catch (error) {
      console.error('Error fetching rarity templates:', error);
      setError(error.message); // Set error message in state
    }
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
  
    // Handle changes for the rarityDistribution select field
    if (name === 'rarityDistributionTemplate') {
      // Update the rarityDistribution in the state to reflect the selected template's distribution
      const selectedTemplate = rarityTemplates.find((template) => template.name === value);
      if (selectedTemplate) {
        setPackFormData((prevState) => ({
          ...prevState,
          rarityDistributionTemplate: value, // Update the selected template name
          rarityDistribution: selectedTemplate.distribution, // Update the distribution itself
        }));
      }
    } else {
      // Handle changes for other fields
      setPackFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const method = editingPack ? 'PUT' : 'POST';
    const url = editingPack ? `/api/packs/${editingPack._id}` : '/api/packs'; // Ensure this URL is correct as per your route setup
  
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
  
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
        body: JSON.stringify(packFormData),
      });
  
      const data = await response.json();
      if (response.ok) {
        fetchPacks(); // Refresh the list of packs
        setEditingPack(null); // Reset the editing state
        setPackFormData({ // Reset the form data
          name: '',
          description: '',
          imageUrl: '',
          rarityDistributionTemplate: '', // Reset this if it's part of your form
        });
      } else {
        // Handle errors, for example, show an error message to the user
        throw new Error(data.message || 'An error occurred while submitting the form.');
      }
    } catch (error) {
      // Handle the error, for example, set an error state or show a notification
      console.error('Error submitting pack:', error);
    }
  };
  
  const handleEdit = (pack) => {
    setEditingPack(pack);
    setPackFormData({
      name: pack.name,
      description: pack.description,
      imageUrl: pack.imageUrl,
      rarityDistributionTemplate: pack.rarityDistributionTemplate, // Assume this is part of your pack object
      rarityDistribution: pack.rarityDistribution,
    });
  };
  
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    if (!token) {
      console.error('No token found, authorization denied');
      return;
    }
  
    try {
      const response = await fetch(`/api/packs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
      });
  
      if (response.ok) {
        fetchPacks(); // Refresh the list of packs after deletion
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Error deleting pack');
      }
    } catch (error) {
      console.error('Error deleting pack:', error.message);
    }
  };
  
    const renderForm = () => (
    <form onSubmit={handleFormSubmit} className="pack-manager-form">
      {/* Form fields for name, description, and imageUrl */}
      <label>
        Name:
        <input type="text" name="name" value={packFormData.name} onChange={handleFormChange} required />
      </label>
      <label>
        Description:
        <input type="text" name="description" value={packFormData.description} onChange={handleFormChange} required />
      </label>
      <label>
        Image URL:
        <input type="text" name="imageUrl" value={packFormData.imageUrl} onChange={handleFormChange} required />
      </label>
      {/* Rarity distribution inputs */}
      <div className="rarity-distribution">
      <label>
      Rarity Distributions:
      <select
      name="rarityDistributionTemplate"
      value={packFormData.rarityDistributionTemplate}
      onChange={handleFormChange}
      required
    >
      {rarityTemplates.map((template) => (
        <option key={template.name} value={template.name}>
          {template.name}
        </option>
      ))}
    </select>
    </label>
      </div>
      <button type="submit">Submit Pack</button>
      {editingPack && (
      <button type="button" onClick={() => setEditingPack(null)}>
        Cancel
      </button>
    )}
    <button type="submit">{editingPack ? 'Update' : 'Add'} Pack</button>
  </form>
  );
    const renderPackList = () => (
    <div className="pack-list">
      {packs.map(pack => (
        <div key={pack._id} className="pack-item">
          <div className="pack-item-header">
            <div className="pack-item-name">{pack.name}</div>
            <div className="pack-item-buttons">
              <button onClick={() => handleEdit(pack)}>Edit</button>
              <button onClick={() => handleDelete(pack._id)}>Delete</button>
            </div>
          </div>
          <div className="pack-item-description">{pack.description}</div>
        </div>
      ))}
    </div>
  );
return (
  <div className="pack-manager-container">
    {renderForm()}
    {renderPackList()}
  </div>
);
};

export default PackManager;
