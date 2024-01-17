import React, { useState, useEffect } from 'react';
import './Marketplace.css';

const Marketplace = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCardsForSale = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/cards/sale'); // Endpoint to fetch cards listed for sale
                const data = await response.json();
                if (response.ok) {
                    setCards(data.cards);
                } else {
                    throw new Error(data.message || 'Error fetching cards');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCardsForSale();
    }, []);

    const handleBuy = async (cardId) => {
        // Implement buy logic here
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="marketplace">
            <h1>Marketplace</h1>
            <div className="cards-container">
                {cards.map(card => (
                    <div key={card._id} className="card">
                        <img src={card.imageUrl} alt={card.name} />
                        <div className="card-details">
                            <h3>{card.name}</h3>
                            <p>Price: {card.price}</p>
                            <button onClick={() => handleBuy(card._id)}>Buy</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Marketplace;
