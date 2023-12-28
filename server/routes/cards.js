const express = require('express');
const router = express.Router();
const Card = require('../models/Card'); // Replace with your actual Card model
const auth = require('../middleware/auth');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

// GET endpoint to list all cards with pagination
router.get('/', auth, async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const cards = await Card.find().skip(skip).limit(limit);
    const total = await Card.countDocuments(); // Get the total number of documents
    res.json({
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      cards
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cards', error: error.message });
  }
});


router.post('/upload', upload.single('csv'), (req, res) => {
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on('data', (data) => {
        // Convert string values to their appropriate types
        const transformedData = {
          name: data.name,
          packId: data.packId,
          team: data.team,
          position: data.position,
          overallRating: parseNumberOrDefault(data.overallRating),
          offensiveSkills: {
            shooting: parseNumberOrDefault(data.shooting),
            dribbling: parseNumberOrDefault(data.dribbling),
            passing: parseNumberOrDefault(data.passing),
          },
          defensiveSkills: {
            onBallDefense: parseNumberOrDefault(data.onBallDefense),
            stealing: parseNumberOrDefault(data.stealing),
            blocking: parseNumberOrDefault(data.blocking),
          },
          physicalAttributes: {
            speed: parseNumberOrDefault(data.speed),
            acceleration: parseNumberOrDefault(data.acceleration),
            strength: parseNumberOrDefault(data.strength),
            verticalLeap: parseNumberOrDefault(data.verticalLeap),
            stamina: parseNumberOrDefault(data.stamina),
          },
          mentalAttributes: {
            basketballIQ: parseNumberOrDefault(data.basketballIQ),
            intangibles: parseNumberOrDefault(data.intangibles),
            consistency: parseNumberOrDefault(data.consistency),
          },
          imageUrl: data.imageUrl,
          rarity: data.rarity, // Ensure this matches one of the enum values
        };
        results.push(transformedData);
      })
      .on('end', async () => {
        try {
          // Validate and insert data into the database
          console.log(results);
          await Card.insertMany(results);
          res.json({ message: 'Cards uploaded successfully' });
        } catch (error) {
          console.error("Error during CSV insertion:", error);
          res.status(500).json({ message: 'Error processing CSV data', error: error.message });
        }
      });
  });
  
  function parseNumberOrDefault(value, defaultValue = 0) {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      return defaultValue;
    }
    return parsed;
  }
  
  

// POST endpoint to create a new card
router.post('/', auth, async (req, res) => {
    try {
      const newCard = new Card(req.body);
      const savedCard = await newCard.save();
      res.status(201).json(savedCard);
    } catch (error) {
      res.status(500).json({ message: 'Error creating card', error: error.message });
    }
  });
  
  // PUT endpoint to update an existing card
  router.put('/:id', auth, async (req, res) => {
    try {
      const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedCard) {
        return res.status(404).json({ message: 'Card not found' });
      }
      res.json(updatedCard);
    } catch (error) {
      res.status(500).json({ message: 'Error updating card', error: error.message });
    }
  });

  // DELETE endpoint to remove all cards
router.delete('/deleteAll', auth, async (req, res) => {
  try {
    await Card.deleteMany({});
    res.json({ message: 'All cards deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting all cards', error: error.message });
  }
});
  
  // DELETE endpoint to remove a card
  router.delete('/:id', auth, async (req, res) => {
    try {
      const deletedCard = await Card.findByIdAndDelete(req.params.id);
      if (!deletedCard) {
        return res.status(404).json({ message: 'Card not found' });
      }
      res.json({ message: `Card with id ${req.params.id} deleted successfully` });
    } catch (error) {
      // Log the error for server-side debugging
      console.error(`Error deleting card with id ${req.params.id}:`, error);
      // Send a user-friendly message to the client
      res.status(500).json({ message: 'Error deleting card', error: 'An unexpected error occurred' });
    }
  });






module.exports = router;
