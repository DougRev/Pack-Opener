import React from 'react';
import './CardModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const CardModal = ({ card, onClose }) => {
  if (!card) return null;

  // Create a variable for card attributes, defaulting to an empty object if not present
  const cardAttributes = card.attributes ? Object.entries(card.attributes) : [];

  const createCardStats = (card) => {
    // Combine all skills and attributes into a single array of objects
    return [
      { label: 'Team', value: card.team },
      { label: 'Position', value: card.position },
      { label: 'Rarity', value: card.rarity },
      { label: 'Shooting', value: card.offensiveSkills.shooting },
      { label: 'Dribbling', value: card.offensiveSkills.dribbling },
      { label: 'Passing', value: card.offensiveSkills.passing },
      { label: 'On Ball Defense', value: card.defensiveSkills.onBallDefense },
      { label: 'Stealing', value: card.defensiveSkills.stealing },
      { label: 'Blocking', value: card.defensiveSkills.blocking },
      { label: 'Speed', value: card.physicalAttributes.speed },
      { label: 'Acceleration', value: card.physicalAttributes.acceleration },
      { label: 'Strength', value: card.physicalAttributes.strength },
      { label: 'Vertical Leap', value: card.physicalAttributes.verticalLeap },
      { label: 'Stamina', value: card.physicalAttributes.stamina },
      { label: 'Basketball IQ', value: card.mentalAttributes.basketballIQ },
      { label: 'Intangibles', value: card.mentalAttributes.intangibles },
      { label: 'Consistency', value: card.mentalAttributes.consistency },
    ];
  };
  
  const cardStats = createCardStats(card);

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} /> 
        </button>
        <div className="card-display">
          <div className="card-image-container">
            <img src={card.imageUrl} alt={card.name} className="card-modal-image" />
          </div>
          <div className="card-details">
            <h2 className="card-title">{card.name}</h2>
            <div className="card-stats-container">
              {cardStats.map(({ label, value }) => (
                <div key={label} className="card-stat">
                  <span className="card-stat-label">{label}:</span>
                  <span className="card-stat-value">{value}</span>
                </div>
              ))}
            </div>

            <div className="card-attributes">
              {/* Use the cardAttributes variable for mapping */}
              {cardAttributes.map(([key, value]) => (
                <p key={key} className="card-attribute">
                  <span className="attribute-name">{key}:</span> {value}
                </p>
              ))}
            </div>
            {/* Action buttons */}
            <div className="card-actions">
              <button className="action-button">Add to Wishlist</button>
              <button className="action-button">Trade</button>
              <button className="action-button">Sell</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
