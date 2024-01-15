function applyStatModifier(attributes, modifier) {
  const modifiedAttributes = {};
  for (const key in attributes) {
    // Apply the modifier and cap the value at 99
    modifiedAttributes[key] = Math.min(99, Math.round(attributes[key] * modifier));
  }
  return modifiedAttributes;
}

module.exports = { applyStatModifier };
