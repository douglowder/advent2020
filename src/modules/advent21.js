// Template for a new Advent module

const fs = require('fs');

const readInput = (inputFilePath) => {
  const lines = fs.readFileSync(inputFilePath, 'utf-8').split('\n');
  const foods = lines.map((l) => {
    const sections = l.split(' (contains ');
    sections[1] = sections[1].replace(')', '');
    return {
      ingredients: new Set(sections[0].split(' ')),
      allergies: new Set(sections[1].split(', ')),
    };
  });
  return foods;
};

const allergyMapAndSafeIngredients = (foods) => {
  const safeIngredients = new Set();
  const allAllergies = new Set();
  for (let f of foods) {
    for (let i of f.ingredients) {
      safeIngredients.add(i);
    }
    for (let a of f.allergies) {
      allAllergies.add(a);
    }
  }
  const allergyMap = new Map();
  while (allAllergies.size > 0) {
    const allergiesToRemove = [];
    for (let a of allAllergies) {
      let ingredientSet = null;
      for (let f of foods) {
        if (f.allergies.has(a)) {
          if (ingredientSet === null) {
            ingredientSet = new Set(
              Array.from(f.ingredients).filter((i) => safeIngredients.has(i)),
            );
          } else {
            ingredientSet = new Set(
              Array.from(ingredientSet).filter((i) => f.ingredients.has(i)),
            );
          }
          if (ingredientSet.size === 1) {
            const ingredient = Array.from(ingredientSet)[0];
            allergyMap.set(a, ingredient);
            allAllergies.delete(a);
            safeIngredients.delete(ingredient);
            break;
          }
        }
      }
    }
  }
  return {
    allergyMap,
    safeIngredients,
  };
};

const part1 = (inputFilePath) => {
  const foods = readInput(inputFilePath);
  const {allergyMap, safeIngredients} = allergyMapAndSafeIngredients(foods);
  return foods
    .map((f) =>
      Array.from(f.ingredients).reduce(
        (a, b) => (safeIngredients.has(b) ? a + 1 : a),
        0,
      ),
    )
    .reduce((a, b) => a + b, 0);
};

const part2 = (inputFilePath) => {
  const foods = readInput(inputFilePath);
  const {allergyMap, safeIngredients} = allergyMapAndSafeIngredients(foods);
  return Array.from(allergyMap.keys())
    .sort()
    .map((k) => allergyMap.get(k))
    .join(',');
};

module.exports = {
  part1,
  part2,
};
