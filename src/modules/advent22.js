// Template for a new Advent module

const fs = require('fs');

const readInput = (inputFilePath) =>
  fs
    .readFileSync(inputFilePath, 'utf-8')
    .split('\n\n')
    .map((s) =>
      s
        .split('\n')
        .filter((l, i) => i > 0)
        .map((n) => parseInt(n)),
    );

const scoreDeck = (deck) => {
  let factor = 1;
  let total = 0;
  while (deck.length > 0) {
    const val = deck.pop();
    total = total + factor * val;
    factor = factor + 1;
  }
  return total;
};

const playOnce = (decks) => {
  while (decks[0].length > 0 && decks[1].length > 0) {
    let cards = [decks[0].shift(), decks[1].shift()];
    if (cards[0] > cards[1]) {
      decks[0].push(cards[0]);
      decks[0].push(cards[1]);
    } else {
      decks[1].push(cards[1]);
      decks[1].push(cards[0]);
    }
  }
  return decks[0].length > 0 ? 0 : 1;
};

const decksHash = (decks) =>
  decks.map((d) => d.map((n) => `${n}`).join(',')).join('|');

const playRecursive = (decks) => {
  const previousDeckStrings = new Set();
  while (decks[0].length > 0 && decks[1].length > 0) {
    const hash = decksHash(decks);
    if (previousDeckStrings.has(hash)) {
      return 0; // Player 1 wins
    } else {
      previousDeckStrings.add(hash);
      let roundResult;
      let cards = [decks[0].shift(), decks[1].shift()];
      const highCard = Math.max(cards[0], cards[1]);
      if (decks[0].length >= cards[0] && decks[1].length >= cards[1]) {
        // Recurse
        const newDecks = [
          decks[0].slice(0, cards[0]),
          decks[1].slice(0, cards[1]),
        ];
        roundResult = playRecursive(newDecks);
      } else {
        // High card wins
        roundResult = highCard === cards[0] ? 0 : 1;
      }
      if (roundResult === 0) {
        decks[0].push(cards[0]);
        decks[0].push(cards[1]);
      } else {
        decks[1].push(cards[1]);
        decks[1].push(cards[0]);
      }
    }
  }
  return decks[0].length > 0 ? 0 : 1;
};

const part1 = (inputFilePath) => {
  const decks = readInput(inputFilePath);
  const winner = playOnce(decks);
  return scoreDeck(decks[winner]);
};

const part2 = (inputFilePath) => {
  const decks = readInput(inputFilePath);
  const winner = playRecursive(decks);
  return scoreDeck(decks[winner]);
};

module.exports = {
  part1,
  part2,
};
