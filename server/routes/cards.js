const express = require('express');
const router = express.Router();
const Card = require('../models/Card'); 
const auth = require('../middleware/auth');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const { applyStatModifier } = require('../utils/cardUtils'); 
const CardTemplate = require('../models/CardTemplate');

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
  console.log(req.file); // This should log the file details
  console.log(req.body); // This will log any other form fields
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on('data', (data) => {
        // Convert string values to their appropriate types
        const transformedData = {
          template: data.templateId,
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
          await Card.insertMany(results);
          res.json({ message: 'Cards uploaded successfully' });
        } catch (error) {
          res.status(500).json({ message: 'Error uploading cards', error: error.message });
        } finally {
          // Delete the file after processing
          fs.unlink(req.file.path, err => {
            if (err) {
              console.error('Error deleting file:', req.file.path, err);
            }
          });
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
  const { id } = req.params;
  const update = req.body;

  // Remove _id from the update object if it exists
  delete update._id;

  try {
    const updatedCard = await Card.findByIdAndUpdate(id, update, { new: true, runValidators: true });
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

// In server/routes/cards.js
router.post('/list/:cardId', auth, async (req, res) => {
  const { cardId } = req.params;
  const { price } = req.body;

  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    card.isListed = true;
    card.price = price;
    card.listedDate = new Date();
    await card.save();

    res.status(200).json({ message: 'Card listed for sale', card });
  } catch (error) {
    res.status(500).json({ message: 'Error listing card', error: error.message });
  }
});

// In server/routes/cards.js
router.post('/buy/:cardId', auth, async (req, res) => {
  const { cardId } = req.params;
  const buyerId = req.user.id;

  try {
    const card = await Card.findById(cardId);
    if (!card || !card.isListed) {
      return res.status(404).json({ message: 'Card not available for sale' });
    }

    const buyer = await User.findById(buyerId);
    if (buyer.currency < card.price) {
      return res.status(400).json({ message: 'Insufficient currency' });
    }

    const seller = await User.findById(card.ownerId);
    if (seller) {
      seller.inventory = seller.inventory.filter(item => item.toString() !== cardId); // Remove the card from the seller's inventory
      await seller.save();
    }

    // Process transaction
    buyer.currency -= card.price;
    buyer.inventory.push(cardId);
    card.isListed= false;
    card.ownerId = buyerId;

    await buyer.save();
    await card.save();
 
    res.status(200).json({ message: 'Card purchased successfully', card });
  } catch (error) {
    res.status(500).json({ message: 'Error processing purchase', error: error.message });
  }

});

// GET endpoint to list cards that are for sale
router.get('/sale', auth, async (req, res) => {
  try {
    const cardsForSale = await Card.find({ isListed: true });
    res.json({ cards: cardsForSale });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cards for sale', error: error.message });
  }
});

router.post('/quicksell/:cardId', auth, async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user.id; // assuming you have user's ID from auth middleware

  try {
    const session = await mongoose.startSession(); // Start a session for transaction
    session.startTransaction(); // Start the transaction

    const card = await Card.findById(cardId).session(session);
    if (!card) {
      await session.abortTransaction(); // Abort transaction if card not found
      session.endSession(); // End the session
      return res.status(404).json({ message:'Card not found' });
    }
    // Ensure the user owns the card
    if (!card.ownerId.equals(userId)) { // Use .equals for ObjectId comparison
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: 'You do not own this card' });
    }

    // Define the currency value for each rarity
    const rarityValues = {
      common: 10,
      uncommon: 20,
      rare: 50,
      epic: 100,
      legendary: 200
    };
    const quickSellValue = rarityValues[card.rarity.toLowerCase()] || 0; // Make sure to call toLowerCase() if your enum values are capitalized

    // Update the user's currency
    const user = await User.findById(userId).session(session);
    user.currency += quickSellValue;
    user.inventory.pull(cardId); // Remove the card from the user's inventory
    await user.save({ session });

    // Delete the card
    await card.remove({ session });

    await session.commitTransaction(); // Commit the transaction
    session.endSession(); // End the session

    res.status(200).json({ message: `Card sold for ${quickSellValue} currency`, newCurrency: user.currency });
    } catch (error) {
      console.error('Error processing quick sell', error);
      res.status(500).json({ message: 'Error processing quick sell', error: error.message });
  }
  
});

module.exports = router;

