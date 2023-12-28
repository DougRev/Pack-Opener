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
          <p>Rarity: {card.rarity}</p>
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
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPack = location.state?.selectedPack; // Assuming selectedPack is passed via route state

  
  useEffect(() => {
    const addCardsToInventory = async (selectedCards) => {
      for (const card of selectedCards) {
        await addCardToInventory(card); // Add each card to the inventory
      }
    };

    const fetchCards = async () => {
      try {
        const response = await fetch('/api/cards', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        console.log(data); // Log the data to see what's actually returned
    
        if (response.ok) {
          // Assuming data is expected to be in the format { cards: [...cardsArray] }
          if (Array.isArray(data.cards)) {
            const packCards = data.cards.filter(card => card.packId === selectedPack._id);
            // rest of your logic...
          } else {
            console.error('Expected an array of cards, but received:', data);
          }
        } else {
          throw new Error(data.message || 'Failed to fetch cards.');
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };
    

  if (selectedPack) {
      fetchCards();
    }
  }, [selectedPack]);

  const handleBackToPackSelection = () => {
    navigate('/packselection');
  };

  const addCardToInventory = async (card) => {
    try {
      const token = localStorage.getItem('token') || ''; // Retrieve the stored token
      const response = await fetch('/api/inventory/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
        body: JSON.stringify(card),
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
  
  

  const toggleFlip = (index) => {
    // Just toggle the flip state, inventory add is handled in fetchCards
    setCards(cards.map((card, cardIndex) => {
      if (cardIndex === index) {
        return { ...card, flipped: !card.flipped };
      }
      return card;
    }));
    if (!cards[index].flipped) {
      setSelectedCard(cards[index]); // Show modal with card details
    }
  };

  return (
    <div id="packOpening">
      <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      {cards.length > 0 ? (
        cards.map((card, index) => (
          <div key={index} className="card" onClick={() => toggleFlip(index)}>
            <img src={card.flipped ? card.imageUrl : "/images/CardBack.png"} alt={card.name} />
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
