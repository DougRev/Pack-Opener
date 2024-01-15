import React, { useState, useEffect } from 'react';
import './CardManager.css';


const initialCardState = {
  name: '',
  team: '',
  position: '',
  overallRating: 0,
  offensiveSkills: {
    shooting: 0,
    dribbling: 0,
    passing: 0
  },
  defensiveSkills: {
    onBallDefense: 0,
    stealing: 0,
    blocking: 0
  },
  physicalAttributes: {
    speed: 0,
    acceleration: 0,
    strength: 0,
    verticalLeap: 0,
    stamina: 0
  },
  mentalAttributes: {
    basketballIQ: 0,
    intangibles: 0,
    consistency: 0
  },
  imageUrl: '',
  rarity: 'Common' // Default to 'Common'
};
const CardManager = () => {
  const [cards, setCards] = useState([]);
  const [editingCard, setEditingCard] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(5); // or whatever limit you choose
  const [totalPages, setTotalPages] = useState(0);
  const [cardTemplates, setCardTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [cardFormData, setCardFormData] = useState({
    name: '',
    team: '',
    position: '',
    overallRating: 0,
    offensiveSkills: {
      shooting: 0,
      dribbling: 0,
      passing: 0
    },
    defensiveSkills: {
      onBallDefense: 0,
      stealing: 0,
      blocking: 0
    },
    physicalAttributes: {
      speed: 0,
      acceleration: 0,
      strength: 0,
      verticalLeap: 0,
      stamina: 0
    },
    mentalAttributes: {
      basketballIQ: 0,
      intangibles: 0,
      consistency: 0
    },
    imageUrl: '',
    rarity: 'Common' // Default to 'Common'
  });

  const teams = [
    'Atlanta Hawks', 'Boston Celtics', 'Brooklyn Nets',
    'Charlotte Hornets', 'Chicago Bulls', 'Cleveland Cavaliers',
    'Dallas Mavericks', 'Denver Nuggets', 'Detroit Pistons',
    'Golden State Warriors', 'Houston Rockets', 'Indiana Pacers',
    'LA Clippers', 'Los Angeles Lakers', 'Memphis Grizzlies',
    'Miami Heat', 'Milwaukee Bucks', 'Minnesota Timberwolves',
    'New Orleans Pelicans', 'New York Knicks', 'Oklahoma City Thunder',
    'Orlando Magic', 'Philadelphia 76ers', 'Phoenix Suns',
    'Portland Trail Blazers', 'Sacramento Kings', 'San Antonio Spurs',
    'Toronto Raptors', 'Utah Jazz', 'Washington Wizards'  ];
  
  const positions = [
    'Point Guard', 'Shooting Guard', 'Small Forward',
    'Power Forward', 'Center'  ];

  useEffect(() => {
    fetchCardTemplates();
    fetchCards();
  }, [currentPage]);
  

  
  const fetchCards = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/cards?page=${currentPage}&limit=${cardsPerPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setCards(data.cards); // Set the cards in the state
        setTotalPages(data.totalPages); // Set the total pages in the state
      } else {
        throw new Error(data.message || 'Failed to fetch cards.');
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
      // handle errors, possibly by setting an error state and displaying it
    }
  };

  const fetchCardTemplates = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/cardTemplate/templates', { // Corrected endpoint
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCardTemplates(data.templates); // Assuming the response has a 'templates' field
      } else {
        throw new Error(data.message || 'Failed to fetch card templates.');
      }
    } catch (error) {
      console.error('Error fetching card templates:', error);
      // Handle error, e.g., by setting an error state or displaying a notification
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCardFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateCardData = () => {
    if (!cardFormData.name.trim()) {
      alert('Name is required.');
      return false;
    }
    if (cardFormData.overallRating < 0 || cardFormData.overallRating > 100) {
      alert('Overall rating must be between 0 and 100.');
      return false;
    }
    return true;
  };

  const handleTemplateChange = (e) => {
    const selectedId = e.target.value;
    setSelectedTemplateId(selectedId);
    const selectedTemplate = cardTemplates.find(t => t._id === selectedId);

    if (selectedTemplate) {
      const updatedCardFormData = {
        ...initialCardState,
        ...selectedTemplate,
        rarity: cardFormData.rarity,
      };
      setCardFormData(updatedCardFormData);
    } else {
      alert('Selected template not found. Please check the templates list.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateCardData()) {
      // If validation fails, do not submit
      return;
    }

    const cardDataToSubmit = {
      ...cardFormData,
      template: selectedTemplateId,
    };
  
    console.log('Submitting card data:', cardDataToSubmit);
  
    const method = editingCard ? 'PUT' : 'POST';
    const url = editingCard ? `/api/cards/${editingCard._id}` : '/api/cards';
    const token = localStorage.getItem('token');
  
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(cardDataToSubmit),
      });
  
      const data = await response.json();
      if (response.ok) {
        // Fetch the updated list of cards and reset the form
        fetchCards();
        setEditingCard(null);
        setCardFormData(initialCardState);
        alert('Card submitted successfully.');
      } else {
        throw new Error(data.message || 'An error occurred while submitting the card.');
      }
    } catch (error) {
      console.error('Error submitting card:', error);
      alert(`Error submitting card: ${error.message}`);
    }
};

  

  const handleEdit = (card) => {
    setEditingCard(card);
    setCardFormData({
      name: card.name,
      team: card.team,
      position: card.position,
      overallRating: card.overallRating,
      offensiveSkills: card.offensiveSkills || initialCardState.offensiveSkills,
      defensiveSkills: card.defensiveSkills || initialCardState.defensiveSkills,
      physicalAttributes: card.physicalAttributes || initialCardState.physicalAttributes,
      mentalAttributes: card.mentalAttributes || initialCardState.mentalAttributes,
      imageUrl: card.imageUrl,
      rarity: card.rarity,
    });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token'); // Ensure you have the token for authorization
    try {
      const response = await fetch(`/api/cards/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setCards(cards.filter(card => card._id !== id)); // Update state to remove the card
      } else {
        throw new Error('Error deleting card');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const handleDeleteAll = async () => {
    const confirmation = window.confirm('Are you sure you want to delete all cards? This action cannot be undone.');
    if (confirmation) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/cards/deleteAll', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          setCards([]);
          alert('All cards have been deleted.');
        } else {
          throw new Error('Failed to delete all cards');
        }
      } catch (error) {
        console.error('Error deleting all cards:', error);
        alert('Error deleting all cards:', error.message);
      }
    }
  };

  return (
    <div className="card-manager-container">
      <h2>Manage Cards</h2>
      <button onClick={handleDeleteAll}>Delete All Cards</button>
      <form onSubmit={handleFormSubmit} className="card-manager-form">
      <label>
          Card Template:
          <select value={selectedTemplateId} onChange={handleTemplateChange} required>
            <option value="">Select a template</option>
            {cardTemplates.map(template => (
              <option key={template._id} value={template._id}>{template.name}</option>
            ))}
          </select>
        </label>
        <label>
          Name:
          <input type="text" name="name" value={cardFormData.name} onChange={handleFormChange} required />
        </label>
        <label>
          Description:
          <textarea name="description" value={cardFormData.description} onChange={handleFormChange} required />
        </label>
        <label>
          Image URL:
          <input type="text" name="imageUrl" value={cardFormData.imageUrl} onChange={handleFormChange} required />
        </label>
        <label>
          Team:
          <select name="team" value={cardFormData.team} onChange={handleFormChange} required>
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </label>
        <label>
          Position:
          <select name="position" value={cardFormData.position} onChange={handleFormChange} required>
            {positions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
        </label>

        <fieldset>
          <legend>Offensive Skills</legend>
          <label htmlFor="offensiveSkills.shooting">Shooting:</label>
          <input type="number" name="offensiveSkills.shooting" value={cardFormData.offensiveSkills.shooting} onChange={handleFormChange} />

          <label htmlFor='offensiveSkills.dribbling'>Dribbling:</label>
          <input type="number" name="offensiveSkills.dribbling" value={cardFormData.offensiveSkills.dribbling} onChange={handleFormChange} />

          <label htmlFor='offensiveSkills.passing'>Passing:</label>
          <input type="number" name="offensiveSkills.passing" value={cardFormData.offensiveSkills.passing} onChange={handleFormChange} />
        </fieldset>

        <fieldset>
          <legend>Defensive Skills</legend>
          <label htmlFor='defensiveSkills.onBallDefense'>On-Ball Defense:</label>
          <input type="number" name="defensiveSkills.onBallDefense" value={cardFormData.defensiveSkills.onBallDefense} onChange={handleFormChange} />

          <label htmlFor='defensiveSkills.stealing'>Stealing:</label>
          <input type="number" name="defensiveSkills.stealing" value={cardFormData.defensiveSkills.stealing} onChange={handleFormChange} />

          <label htmlFor='defensiveSkills.blocking'>Blocking:</label>
          <input type="number" name="defensiveSkills.blocking" value={cardFormData.defensiveSkills.blocking} onChange={handleFormChange} />
        </fieldset>
          
        <fieldset>
          <legend>Physical Attributes</legend>
          <label htmlFor='physicalAttributes.speed'>Speed:</label>
          <input type="number" name="physicalAttributes.speed" value={cardFormData.physicalAttributes.speed} onChange={handleFormChange} />

          <label htmlFor='physicalAttributes.acceleration'>Acceleration:</label>
          <input type="number" name="physicalAttributes.acceleration" value={cardFormData.physicalAttributes.acceleration} onChange={handleFormChange} />

          <label htmlFor='physicalAttributes.strength'>Strength:</label>
          <input type="number" name="physicalAttributes.strength" value={cardFormData.physicalAttributes.strength} onChange={handleFormChange} />

          <label htmlFor='physicalAttributes.verticalLeap'>Vertical Leap:</label>  
          <input type="number" name="physicalAttributes.verticalLeap" value={cardFormData.physicalAttributes.verticalLeap} onChange={handleFormChange} />

          <label htmlFor='physicalAttributes.stamina'>Stamina:</label>
          <input type="number" name="physicalAttributes.stamina" value={cardFormData.physicalAttributes.stamina} onChange={handleFormChange} />
        </fieldset>
        
        <fieldset>
          <legend>Mental Attributes</legend>
          <label htmlFor='mentalAttribtes.basketballIQ'>Basketball IQ</label>
          <input type="number" name="mentalAttributes.basketballIQ" value={cardFormData.mentalAttributes.basketballIQ} onChange={handleFormChange} />

          <label htmlFor='mentalAttributes.intangibles'>Intangibles</label>
          <input type="number" name="mentalAttributes.intangibles" value={cardFormData.mentalAttributes.intangibles} onChange={handleFormChange} />

          <label htmlFor='mentalAttributes.consistency'>Consistency</label>
          <input type="number" name="mentalAttributes.consistency" value={cardFormData.mentalAttributes.consistency} onChange={handleFormChange} />
        </fieldset>

        <fieldset>
          <legend>Result</legend>
          <label htmlFor='overallRating'>Overall Rating</label>
          <input type="number" name="overallRating" value={cardFormData.overallRating} onChange={handleFormChange} required />

          <label htmlFor='rarity'>Rarity:</label>
          <select name="rarity" value={cardFormData.rarity} onChange={handleFormChange} required>
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="Epic">Epic</option>
            <option value="Legendary">Legendary</option>
          </select>
        </fieldset>

      
      <button type="submit">{editingCard ? 'Update' : 'Create'}</button>
      </form>
      <div>
      <ul className="card-list">
        {cards.map(card => (
          <li key={card._id} className="card-item">
            <img src={card.imageUrl} alt={card.name} className="card-image"/>
            <div className="card-details">
              <h3>{card.name}</h3>
              <p>{card.team} - {card.position}</p>
              <p>Rarity: {card.rarity}</p>
              {/* Use optional chaining when accessing nested properties */}
              <p>Shooting: {card.offensiveSkills?.shooting || 'N/A'}</p>
              <p>Dribbling: {card.offensiveSkills?.dribbling || 'N/A'}</p>
              <p>Passing: {card.offensiveSkills?.passing || 'N/A'}</p>
              <p>On-Ball Defense: {card.defensiveSkills?.onBallDefense || 'N/A'}</p>
              <p>Stealing: {card.defensiveSkills?.stealing || 'N/A'}</p>
              <p>Blocking: {card.defensiveSkills?.blocking || 'N/A'}</p>
              <p>Speed: {card.physicalAttributes?.speed || 'N/A'}</p>
              <p>Acceleration: {card.physicalAttributes?.acceleration || 'N/A'}</p>
              <p>Strength: {card.physicalAttributes?.strength || 'N/A'}</p>
              <p>Vertical Leap: {card.physicalAttributes?.verticalLeap || 'N/A'}</p>
              <p>Stamina: {card.physicalAttributes?.stamina || 'N/A'}</p>
              <p>Basketball IQ: {card.mentalAttributes?.basketballIQ || 'N/A'}</p>
              <p>Intangibles: {card.mentalAttributes?.intangibles || 'N/A'}</p>
              <p>Consistency: {card.mentalAttributes?.consistency || 'N/A'}</p>

              <div className="card-item-buttons">
                <button onClick={() => handleEdit(card)}>Edit</button>
                <button onClick={() => handleDelete(card._id)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      </div>
      <div className="pagination-controls">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button key={page} disabled={currentPage === page} onClick={() => setCurrentPage(page)}>
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CardManager;
