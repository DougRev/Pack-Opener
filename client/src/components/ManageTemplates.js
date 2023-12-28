import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        team: '',
        position: '',
        imageUrl: '',
        rarity: '',
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

    const [editTemplate, setEditTemplate] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const token = localStorage.getItem('token'); // Or however you store your token
    const authHeader = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
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
        }
      };
      
      const handleCreate = async () => {
        try {
          const token = localStorage.getItem('token'); // Or however you store your token
          const response = await axios.post('/api/cardTemplate/templates', newTemplate, {
            headers: {
              Authorization: `Bearer ${token}` // Assumes a Bearer token
            }
          });
          fetchTemplates();
          setNewTemplate({ name: '', team: '', position: '', imageUrl: '', rarity: '' });
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
            await axios.delete(`/api/cardTemplate/${id}`, authHeader);
            fetchTemplates();
        } catch (error) {
            console.error('Error deleting template:', error);
        }
    };
      

    const handleChangeNew = (e) => {
    if (['shooting', 'dribbling', 'passing', 'onBallDefense', 'stealing', 'blocking', 'speed', 'acceleration', 'strength', 'verticalLeap', 'stamina', 'basketballIQ', 'intangibles', 'consistency'].includes(e.target.name)) {
        // Handle nested state updates for skills and attributes
        const category = Object.keys(newTemplate).find(key => newTemplate[key] && newTemplate[key].hasOwnProperty(e.target.name));
        setNewTemplate(prevState => ({
        ...prevState,
        [category]: {
            ...prevState[category],
            [e.target.name]: Number(e.target.value)
        }
        }));
    } else {
        // Handle regular state updates
        setNewTemplate({ ...newTemplate, [e.target.name]: e.target.value });
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
      
      

    return (
        <div className="template-manager">
            <h1>Card Templates</h1>
            <div className="new-template-form">
                <h3>Add New Template</h3>
                <input type="text" name="name" placeholder="Name" value={newTemplate.name} onChange={handleChangeNew} />
                <input type="text" name="team" placeholder="Team" value={newTemplate.team} onChange={handleChangeNew} />
                <input type="text" name="position" placeholder="Position" value={newTemplate.position} onChange={handleChangeNew} />
                <input type="text" name="imageUrl" placeholder="Image URL" value={newTemplate.imageUrl} onChange={handleChangeNew} />
                <input type="text" name="rarity" placeholder="Rarity" value={newTemplate.rarity} onChange={handleChangeNew} />
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
