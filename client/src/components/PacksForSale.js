
<div className="packs-for-sale">
  {packs.map((pack) => (
    <div key={pack._id} className="pack-for-sale">
      <img src={pack.imageUrl} alt={pack.name} />
      <h3>{pack.name}</h3>
      <p>{pack.description}</p>
      {/* Display rarity distribution */}
      <ul className="rarity-distribution">
        {Object.entries(pack.rarityDistribution).map(([rarity, chance]) => (
          <li key={rarity}>{rarity}: {chance}%</li>
        ))}
      </ul>
      {/* ... */}
    </div>
  ))}
</div>
