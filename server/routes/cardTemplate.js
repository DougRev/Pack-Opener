const express = require('express');
const router = express.Router();
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const CardTemplate = require('../models/CardTemplate'); // Assuming this is the correct path
const auth = require('../middleware/auth');

const upload = multer({ dest: 'uploads/' });

// GET endpoint to list all card templates with pagination
router.get('/templates', auth, async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    try {
        const templates = await CardTemplate.find().skip(skip).limit(limit);
        const total = await CardTemplate.countDocuments();
        res.json({
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            templates
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching card templates', error: error.message });
    }
});

// POST endpoint to create a new card template
router.post('/templates', auth, async (req, res) => {
    try {
        const newTemplate = new CardTemplate(req.body);
        const savedTemplate = await newTemplate.save();
        res.status(201).json(savedTemplate);
    } catch (error) {
        console.error(error); // This will help you see the detailed error in the server logs
        res.status(500).json({ message: 'Error creating card template', error: error.message });
    }
});

// PUT endpoint to update an existing card template
router.put('/templates/:id', auth, async (req, res) => {
    try {
        const updatedTemplate = await CardTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTemplate) {
            return res.status(404).json({ message: 'Template not found' });
        }
        res.json(updatedTemplate);
    } catch (error) {
        res.status(500).json({ message: 'Error updating template', error: error.message });
    }
});

// DELETE endpoint to remove a card template
router.delete('/templates/:id', auth, async (req, res) => {
    try {
        const deletedTemplate = await CardTemplate.findByIdAndDelete(req.params.id);
        if (!deletedTemplate) {
            return res.status(404).json({ message: 'Template not found' });
        }
        res.json({ message: 'Template deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting template', error: error.message });
    }
});

router.post('/upload', upload.single('file'), (req, res) => {
    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on('data', (data) => {
            // Map the flat CSV structure to the nested schema structure
            const templateData = {
                name: data.name,
                team: data.team,
                position: data.position,
                overallRating: undefined, // This will be calculated pre-save
                offensiveSkills: {
                    shooting: data.shooting,
                    dribbling: data.dribbling,
                    passing: data.passing
                },
                defensiveSkills: {
                    onBallDefense: data.onBallDefense,
                    stealing: data.stealing,
                    blocking: data.blocking
                },
                physicalAttributes: {
                    speed: data.speed,
                    acceleration: data.acceleration,
                    strength: data.strength,
                    verticalLeap: data.verticalLeap,
                    stamina: data.stamina
                },
                mentalAttributes: {
                    basketballIQ: data.basketballIQ,
                    intangibles: data.intangibles,
                    consistency: data.consistency
                },
                imageUrl: data.imageUrl,
                rarity: data.rarity
            };
            results.push(templateData);
        })
        .on('end', () => {
            // Validate and insert data into the database
            results.forEach(templateData => {
                const newTemplate = new CardTemplate(templateData);
                newTemplate.save(); // Add error handling and validation
            });
            res.json({ message: 'Card templates uploaded successfully' });
            res.send('Card templates uploaded successfully');
        });
});

module.exports = router;
