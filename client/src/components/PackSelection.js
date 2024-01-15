import React, { useState, useEffect } from 'react';
import './PackSelection.css';
import { useNavigate } from 'react-router-dom';

const PackSelection = () => {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchPacks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/packs', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch packs');
        }
        const data = await response.json();
        setPacks(data);
      } catch (error) {
        setError('Error fetching packs: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPacks();
  }, []);

  const handlePackClick = (pack) => {
    navigate('/carddisplay', { state: { selectedPackId: pack._id } });
  };
  
  const handleBackToHome = () => {
    navigate('/home');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div id="packSelection">
      {packs.map(pack => (
        <div key={pack._id} className="pack-option" onClick={() => handlePackClick(pack)}>
          <img src={pack.imageUrl || '/default-pack-image.png'} alt={pack.name} />
          <p>{pack.name}</p>
        </div>
      ))}
      <button id="backToHomeFromPackSelection" onClick={handleBackToHome}>Back to Home</button>
    </div>
  );
};

export default PackSelection;
