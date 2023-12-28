import React, { useState, useEffect } from 'react';
import './PackSelection.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const PackSelection = ({ onPackSelect }) => {
  const [packs, setPacks] = useState([]); // Initialize packs state as empty array
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const response = await fetch('/packs.json');
        const data = await response.json();
        setPacks(data);
      } catch (error) {
        console.error('Error fetching packs:', error);
      }
    };
  
    fetchPacks();
  }, []);

const handlePackClick = (packId) => {
  // Find the selected pack based on packId
  const selectedPack = packs.find(pack => pack.id === packId);
  if (selectedPack) {
    // Navigate to CardDisplay and pass the selectedPack in the state
    navigate('/carddisplay', { state: { selectedPack: selectedPack } });
  }
};


  const handleBackToHome = () => {
    navigate('/home'); // Navigate to the home route
  };

  return (
    <div id="packSelection">
      {packs.map((pack, index) => (
        <div key={index} className="pack-option" onClick={() => handlePackClick(pack.id)}>
          <img src={pack.image} alt={`Pack ${index + 1}`} />
          <p>{pack.name}</p> {/* Display the pack name */}
        </div>
      ))}
      <button id="backToHomeFromPackSelection" onClick={handleBackToHome}>Back to Home</button>
    </div>
  );
};

export default PackSelection;
