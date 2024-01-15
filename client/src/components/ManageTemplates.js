import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageTemplates = () => {
    const [templates, setTemplates] = useState([]);
    // Initial template structure based on the Rarity schema
    const initialRarities = [
        { level: 'Common', imageUrl: '', statModifier: 1 },
        { level: 'Uncommon', imageUrl: '', statModifier: 1.1 },
        { level: 'Rare', imageUrl: '', statModifier: 1.2 },
        { level: 'Epic', imageUrl: '', statModifier: 1.5 },
        { level: 'Legendary', imageUrl: '', statModifier: 2 },
      ];
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        packId: '', 
        team: '',
        position: '',
        imageUrl: '',
        rarities: initialRarities,
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
        }
      });
    
    // Enum for NBA teams
    const teamsEnum = [
      'Atlanta Hawks', 'Boston Celtics', 'Brooklyn Nets',
      'Charlotte Hornets', 'Chicago Bulls', 'Cleveland Cavaliers',
      'Dallas Mavericks', 'Denver Nuggets', 'Detroit Pistons',
      'Golden State Warriors', 'Houston Rockets', 'Indiana Pacers',
      'LA Clippers', 'Los Angeles Lakers', 'Memphis Grizzlies',
      'Miami Heat', 'Milwaukee Bucks', 'Minnesota Timberwolves',
      'New Orleans Pelicans', 'New York Knicks', 'Oklahoma City Thunder',
      'Orlando Magic', 'Philadelphia 76ers', 'Phoenix Suns',
      'Portland Trail Blazers', 'Sacramento Kings', 'San Antonio Spurs',
      'Toronto Raptors', 'Utah Jazz', 'Washington Wizards'
    ];

    // Enum for NBA positions
    const positionsEnum = [
      'Point Guard', 'Shooting Guard', 'Small Forward',
      'Power Forward', 'Center'
    ];

    const [editTemplate, setEditTemplate] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const token = localStorage.getItem('token'); // Or however you store your token
    const authHeader = { Authorization: `Bearer ${token}` };
    const [packs, setPacks] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
      const token = localStorage.getItem('token');
      const authHeader = { Authorization: `Bearer ${token}` };
    
      const fetchPacks = async () => {
        try {
          const packResponse = await axios.get('/api/packs', { headers: authHeader });
          if (packResponse.data) {
            setPacks(packResponse.data); // Assuming packResponse.data is the array of packs
          }
        } catch (error) {
          console.error('Error fetching packs:', error);
        }
      };
    
      const fetchTemplates = async () => {
        try {
          const templateResponse = await axios.get('/api/cardTemplate/templates', { headers: authHeader });
          if (templateResponse.data) {
            setTemplates(templateResponse.data.templates); // Assuming templateResponse.data.templates is the array of templates
          }
        } catch (error) {
          console.error('Error fetching templates:', error);
        }
      };
    
      fetchPacks();
      fetchTemplates();
    }, []); 
    
    
    
    const fetchTemplates = async () => {
      setIsLoading(true); // Start loading
        try {
          const token = localStorage.getItem('token'); // Replace with however you store your token
          const response = await axios.get('/api/cardTemplate/templates', {
            headers: {
              Authorization: `Bearer ${token}` // Assumes a Bearer token
            }
          });
          setTemplates(response.data.templates);
        } catch (error) {
          console.error('Error fetching templates:', error);
        }finally {
          setIsLoading(false);
        }
      };

    // Correctly pass the event object to the handleCreate function
const handleCreate = async (e) => {
  e.preventDefault(); // Prevent the default form submission behavior
  try {
    console.log('Creating new template with data:', newTemplate);

    // Check if team and position are present
    if (!newTemplate.team || !newTemplate.position) {
      console.error('Team or position is missing:', newTemplate);
      // You could alert the user or stop the submission here
      return;
    }

    // Send the POST request to the server
    const response = await axios.post('/api/cardTemplate/templates', newTemplate, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Assuming you want to do something with the response here
    // For example, fetch templates again to update the list
    fetchTemplates();

    // Reset the form to the initial state if needed
    setNewTemplate({
      name: '',
      packId: '', 
      team: '',
      position: '',
      imageUrl: '',
      rarities: initialRarities,
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
      }
    });

  } catch (error) {
    console.error('Error creating template:', error);
  }
};


      

    const handleUpdate = async (id) => {
        try {
            const response = await axios.put(`/api/cardTemplate/templates/${id}`, editTemplate, {
              headers: {
                Authorization: `Bearer ${token}` // Assumes a Bearer token
              }
            });
            fetchTemplates();
            setEditTemplate(null);
            setEditingId(null);
        } catch (error) {
            console.error('Error updating template:', error);
        }
    };
    const handleDelete = async (id) => {
      try {
          await axios.delete(`/api/cardTemplate/templates/${id}`, {
            headers: {
              Authorization: `Bearer ${token}` // Assumes a Bearer token
            }
          });
          fetchTemplates();
      } catch (error) {
          console.error('Error deleting template:', error.response?.data || error);
          alert('Error deleting template: ' + (error.response?.data.message || error.message));
      }
  };
  
      
  const handleChangeNew = (e) => {
    const { name, value } = e.target;

    // Handle nested object updates
    if (name.includes('.')) {
      const [category, field] = name.split('.');
      setNewTemplate(prevState => ({
        ...prevState,
        [category]: {
          ...prevState[category],
          [field]: Number(value) || 0,
        },
      }));
    } else {
      setNewTemplate(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  
    const handleChangeEdit = (e) => {
        const { name, value } = e.target;
        const [category, key] = name.split('.');
      
        if (category && key) {
          // Handle nested state updates for skills and attributes
          setEditTemplate(prevState => ({
            ...prevState,
            [category]: {
              ...prevState[category],
              [key]: isNaN(value) ? value : Number(value)
            }
          }));
        } else {
          // Handle regular state updates
          setEditTemplate({
            ...editTemplate,
            [name]: isNaN(value) ? value : Number(value)
          });
        }
      };
      
      
    const startEdit = (template) => {
        setEditingId(template._id);
        setEditTemplate({ ...template });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTemplate(null);
    };

    const handleFileChange = (e) => {
      setSelectedFile(e.target.files[0]);
  };

// Handle file upload
const handleFileUpload = async () => {
  if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
  }

  const formData = new FormData();
  formData.append('csv', selectedFile);

  try {
      const response = await axios.post('/api/cardTemplate/upload', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`, // Assumes a Bearer token
          },
      });
      alert('Templates uploaded successfully!');
      console.log(response.data);
      fetchTemplates(); // Refresh the list of templates after upload
  } catch (error) {
      console.error('Error uploading templates:', error);
      alert('Error uploading templates: ' + (error.response?.data.message || error.message));
  }
};

      
    // Render form inputs for nested objects
    const renderSkillInputs = (skills, prefix) => {
        return (
          <>
            {Object.keys(skills).map(skill => (
              <div key={`${prefix}-${skill}`} className="input-group">
                <label htmlFor={`${prefix}.${skill}`}>
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}:
                </label>
                <input
                  type="number"
                  id={`${prefix}.${skill}`}
                  name={`${prefix}.${skill}`}
                  placeholder={skill}
                  value={editingId ? editTemplate[prefix][skill] : newTemplate[prefix][skill]}
                  onChange={editingId ? handleChangeEdit : handleChangeNew}
                />
              </div>
            ))}
          </>
        );
    };

    console.log('Rendering packs before return:', packs);
    
    return (
        <div className="template-manager">
            <h1>Card Templates</h1>
            <div className="csv-upload-form">
                <h3>Upload Card Templates CSV</h3>
                <input type="file" accept=".csv" onChange={handleFileChange} />
                <button onClick={handleFileUpload}>Upload CSV</button>
            </div>
            <div className="new-template-form">
                <h3>Add New Template</h3>
                <input type="text" name="name" placeholder="Name" value={newTemplate.name} onChange={handleChangeNew} />

                <label>Pack:</label>
                <select name="packId" value={newTemplate.packId} onChange={handleChangeNew} required>
                  <option value="">Select a pack</option>
                  {packs && packs.map(pack => (
                  <option key={pack._id} value={pack._id}>{pack.name}</option>
                ))}
                </select>

                <label>Team:</label>
                <select name="team" value={newTemplate.team} onChange={handleChangeNew} required>
                    {teamsEnum.map(team => (
                        <option key={team} value={team}>{team}</option>
                    ))}
                </select>                
                <label>Position:</label>
                <select name="position" value={newTemplate.position} onChange={handleChangeNew} required>
                  <option value="" disabled>Select a position</option>
                  {positionsEnum.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>

                <label>Rarity:</label>
                <select name="rarity" value={newTemplate.rarity} onChange={handleChangeNew}>
                    {initialRarities.map(rarity => (
                        <option key={rarity.level} value={rarity.level}>{rarity.level}</option>
                    ))}
                </select>

                <input type="text" name="imageUrl" placeholder="Image URL" value={newTemplate.imageUrl} onChange={handleChangeNew} />
                <button onClick={handleCreate}>Create Template</button>
            </div>
            {templates.map(template => (
                <div key={template._id} className="template">
                    <h2>{template.name}</h2>
                    {/* Display other properties */}
                    {editingId === template._id ? (
                        <div className="edit-template-form">
                            <label htmlFor="name">Name:</label>
                            <input type="text" name="name" placeholder="Name" value={editTemplate.name} onChange={handleChangeEdit} />
                            <h3>Offensive Skills</h3>
                            {renderSkillInputs(editTemplate.offensiveSkills, 'offensiveSkills')}
                            <h3>Defensive Skills</h3>
                            {renderSkillInputs(editTemplate.defensiveSkills, 'defensiveSkills')}
                            <h3>Physical Attributes</h3>
                            {renderSkillInputs(editTemplate.physicalAttributes, 'physicalAttributes')}
                            <h3>Mental Attributes</h3>
                            {renderSkillInputs(editTemplate.mentalAttributes, 'mentalAttributes')}
                            <button onClick={() => handleUpdate(template._id)}>Update</button>
                            <button onClick={cancelEdit}>Cancel</button>
                        </div>
                        ) : (
                        <div className="template-actions">
                            <button onClick={() => startEdit(template)}>Edit</button>
                            <button onClick={() => handleDelete(template._id)}>Delete</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ManageTemplates;
