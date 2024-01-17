import React, { useState, useEffect } from 'react';
import './CardDisplay.css';
import { useLocation, useNavigate } from 'react-router-dom';

const CardModal = ({ card, onClose }) => {
  if (!card) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <img src={card.imageUrl} alt={card.name} style={{ width: '80%', height: 'auto' }} />
        <div className="card-info">
          <h2>{card.name}</h2>
          <p>Team: {card.team}</p>
          <p>Position: {card.position}</p>
          <p>Rarity: {card.rarity}</p> {/* Adjusted to directly show card rarity */}
          <p>Overall Rating: {card.overallRating}</p>
          {/* Display skills and attributes */}
          <div className="card-stats">
            <p>Shooting: {card.offensiveSkills.shooting}</p>
            <p>Dribbling: {card.offensiveSkills.dribbling}</p>
            <p>Passing: {card.offensiveSkills.passing}</p>
            {/* Add more stats as per your schema */}
          </div>
        </div>
      </div>
    </div>
  );
};


const CardDisplay = () => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const openPack = async () => {
    setLoading(true);
    try {
      const packId = location.state?.selectedPackId;
      if (!packId) {
        throw new Error('No pack selected');
      }
  
      const response = await fetch(`/api/packs/open/${packId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json();
      console.log('Server response:', data);  // Log the server response here
      if (!response.ok) throw new Error(data.message || 'Failed to open pack');
      setCards(currentCards => [...currentCards, ...data.cards]);
    } catch (error) {
      console.error('Error opening pack:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    openPack(); // Simulate opening a pack when the component mounts
  }, []);
  
  useEffect(() => {
    console.log(`Number of cards received: ${cards.length}`);
    console.log(cards); // Log the entire cards array
  }, [cards]); // Add cards as a dependency here
    
  
  const handleBackToPackSelection = () => {
    navigate('/packselection');
  };

  const fetchCurrency = async () => {
    try {
      const response = await fetch('/api/user/currency', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'), // or however you store your token
        },
      });
      // ... rest of your code ...
    } catch (error) {
      console.error('Failed to fetch currency', error);
    }
  };
  

  const addCardToInventory = async (card) => {
    try {
      const token = localStorage.getItem('token') || ''; // Retrieve the stored token
      const cardId = card._id; // Extract the cardId from the card object
      const response = await fetch('/api/inventory/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
        body: JSON.stringify({ cardId }), // Use the extracted cardId here
      });
  
      const responseData = await response.json(); // Parse JSON response  
      if (!response.ok) {
        throw new Error(`Failed to add card to inventory: ${response.statusText}`);
      }
  
      // Log the success message
      console.log(`Card '${responseData.name}' added to inventory successfully.`, responseData);
      // Here you might want to update the client-side inventory state or handle the success case
    } catch (error) {
      console.error('Error adding card to inventory:', error);
      alert(`Error adding card to inventory: ${error.message}`);
    }
  };
  
  
  const toggleFlip = (cardId) => {
    setSelectedCard(null); // Reset the selected card
    const flippedCards = cards.map(card => {
      if (card._id === cardId) {
        return { ...card, flipped: !card.flipped };
      }
      return card;
    });
    setCards(flippedCards);
  };
  

  if (loading) return <div>Loading cards...</div>;
  if (error) return <div>{error}</div>;


return (
    <div id="packOpening">
      <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      {cards.length ? (
        cards.map(card => (
        <div key={card._id} className="card" onClick={() => toggleFlip(card._id)}>
          <img src={card.flipped ? card.imageUrl : "/images/CardBack.png"} alt={card.name || 'Card'} />
        </div>

        ))
      ) : (
        <p>No cards available for this pack.</p>
      )}
      <button id="backToPackSelection" onClick={handleBackToPackSelection}>
        Back to Packs
      </button>
    </div>
  );
};


export default CardDisplay;
