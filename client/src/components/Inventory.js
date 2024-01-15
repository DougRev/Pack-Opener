import React, { useState, useEffect } from 'react';
import CardModal from './CardModal';
import Pagination from './Pagination'; // You need to create this component
import './Inventory.css'; 

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(10);

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


  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = inventory.slice(indexOfFirstCard, indexOfLastCard);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  return (
    <div className="inventory-page">
      <div className="inventory-container">
        {selectedCard && (
          <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
        )}
        {currentCards.map((card, index) => (
          <div key={card._id} className={`card-item rarity-${card.rarity.toLowerCase()}`} onClick={() => setSelectedCard(card)}>
            <img src={card.imageUrl} alt={card.name} className="card-image" />
          </div>
        ))}
      </div>
      <Pagination cardsPerPage={cardsPerPage} totalCards={inventory.length} paginate={paginate} />
    </div>
  );
};
export default Inventory;
