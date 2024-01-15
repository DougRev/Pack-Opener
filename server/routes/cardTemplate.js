const express = require('express');
const router = express.Router();
const CardTemplate = require('../models/CardTemplate'); // Assuming this is the correct path
const auth = require('../middleware/auth');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
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

router.post('/upload', upload.single('csv'), (req, res) => {
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on('data', (data) => {
        const rarities = [
          { level: 'Common', imageUrl: data.CommonImageUrl || '', statModifier: Number(data.CommonStatModifier) },
          { level: 'Uncommon', imageUrl: data.UncommonImageUrl || '', statModifier: Number(data.UncommonStatModifier) },
          { level: 'Rare', imageUrl: data.RareImageUrl || '', statModifier: Number(data.RareStatModifier) },
          { level: 'Epic', imageUrl: data.EpicImageUrl || '', statModifier: Number(data.EpicStatModifier) },
          { level: 'Legendary', imageUrl: data.LegendaryImageUrl || '', statModifier: Number(data.LegendaryStatModifier) },
        ];
      
        const transformedData = {
          name: data.name,
          team: data.team,
          position: data.position,
          overallRating: Number(data.overallRating),
          offensiveSkills: {
            shooting: Number(data.shooting),
            dribbling: Number(data.dribbling),
            passing: Number(data.passing),
          },
          defensiveSkills: {
            onBallDefense: Number(data.onBallDefense),
            stealing: Number(data.stealing),
            blocking: Number(data.blocking),
          },
          physicalAttributes: {
            speed: Number(data.speed),
            acceleration: Number(data.acceleration),
            strength: Number(data.strength),
            verticalLeap: Number(data.verticalLeap),
            stamina: Number(data.stamina),
          },
          mentalAttributes: {
            basketballIQ: Number(data.basketballIQ),
            intangibles: Number(data.intangibles),
            consistency: Number(data.consistency),
          },
          imageUrl: data.imageUrl,
          rarities: rarities.filter(rarity => rarity.statModifier),
        };
        results.push(transformedData);
      })
      .on('end', async () => {
        try {
          // Insert the card templates into the database
          await CardTemplate.insertMany(results);
          res.json({ message: 'Card templates uploaded successfully' });
          // Delete the file after processing
          fs.unlink(req.file.path, err => {
            if (err) console.error('Error deleting file:', req.file.path, err);
          });
        } catch (error) {
          res.status(500).json({ message: 'Error uploading card templates', error: error.message });
          fs.unlink(req.file.path, err => {
            if (err) console.error('Error deleting file:', req.file.path, err);
          });
        }
      });
});


module.exports = router;
