import React, { useState, useEffect } from 'react';
import './Inventory.css'; // Assume you create a CSS file for this component

const Inventory = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        // Replace 'yourTokenVar' with the actual variable where you store the token
        const token = localStorage.getItem('token') || ''; // Assuming the token is stored in localStorage
        const response = await fetch('/api/inventory', {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            // other headers...
          },
        });
    
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          setInventory(data);
        } else {
          // Handle non-OK responses or when data is not an array
          console.error('Received non-array data or error:', data);
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };
    

    fetchInventory();
  }, []);


  return (
    <div className="inventory-container">
      {inventory.map(card => (
        // Make sure that each card has a unique `_id` property
        // If your data uses a different unique identifier, use that instead
        <div key={card._id} className="card-item"> 
          <img src={card.imageUrl} alt={card.name} className="card-image" />
          <h3 className="card-name">{card.name}</h3>
          <p className="card-description">{card.description}</p>
          {/* Add more details as needed */}
        </div>
      ))}
    </div>
  );
};
export default Inventory;
