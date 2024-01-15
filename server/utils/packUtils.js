const Card = require('../models/Card'); 

function selectRandomRarity(rarityDistribution) {
  const total = rarityDistribution.common + rarityDistribution.uncommon +
                rarityDistribution.rare + rarityDistribution.epic +
                rarityDistribution.legendary;
  const random = Math.random() * total;
  let cumulative = 0;

  for (const [rarity, probability] of Object.entries(rarityDistribution)) {
    cumulative += probability;
    if (random <= cumulative)
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
  }
}
async function selectCardsBasedOnRarity(pack) {
  const selectedCards = [];
  const selectedCardIds = new Set(); // Keep track of selected card IDs
  const numberOfCardsToSelect = 5;

  for (let i = 0; i < numberOfCardsToSelect; i++) {
    const rarity = selectRandomRarity(pack.rarityDistribution);
    let cards = await Card.find({ rarity: rarity });
    cards = cards.filter(card => !selectedCardIds.has(card._id.toString()));

    if (cards.length > 0) {
      const randomIndex = Math.floor(Math.random() * cards.length);
      selectedCards.push(cards[randomIndex]);
      selectedCardIds.add(cards[randomIndex]._id.toString());
    }
  }
  console.log(selectedCards);
  return selectedCards;
}


module.exports = { selectRandomRarity, selectCardsBasedOnRarity };
