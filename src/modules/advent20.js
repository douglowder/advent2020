// Template for a new Advent module

const fs = require('fs');

const readInput = (inputFilePath) => {
  const tileMap = new Map();
  fs.readFileSync(inputFilePath, 'utf-8')
    .split('\n\n')
    .map((s) => {
      const sections = s.split(':\n');
      const id = sections[0].split(' ')[1];
      const tile = sections[1]
        .split('\n')
        .map((s) => s.split('').map((c) => (c === '#' ? '1' : '0')));
      tileMap.set(id, tile);
    });
  return tileMap;
};

const rotateLeft = (tile) => {
  const tileSize = tile.length;
  const newTile = new Array(tileSize)
    .fill('')
    .map((r) => new Array(tileSize).fill(''));
  tile.map((r, j) =>
    r.map((c, i) => {
      newTile[tileSize - 1 - i][j] = c;
    }),
  );
  return newTile;
};

const rotateRight = (tile) => {
  const tileSize = tile.length;
  const newTile = new Array(tileSize)
    .fill('')
    .map((r) => new Array(tileSize).fill(''));
  tile.map((r, j) =>
    r.map((c, i) => {
      newTile[i][tileSize - 1 - j] = c;
    }),
  );
  return newTile;
};

const flip = (tile) => {
  const tileSize = tile.length;
  const newTile = new Array(tileSize)
    .fill('')
    .map((r) => new Array(tileSize).fill(''));
  tile.map((r, j) =>
    r.map((c, i) => {
      newTile[j][tileSize - 1 - i] = c;
    }),
  );
  return newTile;
};

const edges = (tile) => {
  const tileSize = tile.length;
  const top = parseInt(tile[0].join(''), 2);
  const bottom = parseInt(tile[tileSize - 1].join(''), 2);
  const left = parseInt(tile.map((r, i) => tile[i][0]).join(''), 2);
  const right = parseInt(tile.map((r, i) => tile[i][tileSize - 1]).join(''), 2);
  return [left, top, right, bottom];
};

const flipEdge = (edge, tileSize) => {
  let flipped = edge & 1;
  let count = tileSize - 1;

  while (count > 0) {
    edge = edge >> 1;
    flipped = (flipped << 1) + (edge & 1);
    count = count - 1;
  }
  return flipped;
};

const testFlipEdge = () => {
  for (let i = 0; i < 1024; i++) {
    const flipped = flipEdge(i, 10);
    console.log(
      i.toString(2).padStart(10, '0').substring(0, 10) +
        ' ' +
        flipped.toString(2).padStart(10, '0'.substring(0, 10)),
    );
  }
};

const neighborMap = (tileMap) => {
  // Each tile maps to a set of four edges
  const edgeMap = new Map();
  for (let key of tileMap.keys()) {
    edgeMap.set(key, new Set(edges(tileMap.get(key))));
  }
  const neighbors = new Map();
  for (let key of tileMap.keys()) {
    const tileSize = tileMap.get(key).length;
    neighbors.set(key, new Set());
    for (let edge of edgeMap.get(key)) {
      for (let key2 of edgeMap.keys()) {
        if (
          (edgeMap.get(key2).has(edge) ||
            edgeMap.get(key2).has(flipEdge(edge, tileSize))) &&
          key2 !== key
        ) {
          neighbors.get(key).add(key2);
        }
      }
    }
  }
  return neighbors;
};

const gridOfTileIds = (tileMap) => {
  const neighbors = neighborMap(tileMap);
  const cornerTileIds = Array.from(neighbors.keys()).filter(
    (key) => neighbors.get(key).size === 2,
  );
  const sideTileIds = Array.from(neighbors.keys()).filter(
    (key) => neighbors.get(key).size === 3,
  );
  // Get dimension of tile grid and create empty grid
  const gridSize = Math.floor(Math.sqrt(tileMap.size));
  const grid = new Array(gridSize)
    .fill('')
    .map((r) => new Array(gridSize).fill(''));

  // Prepare some sets
  const cornerSet = new Set(cornerTileIds);
  const sideSet = new Set(sideTileIds);
  // Remove tile IDs from this set as they are placed in the grid
  const tileSet = new Set(Array.from(tileMap.keys()));
  // Top left corner
  grid[0][0] = cornerTileIds[0];
  tileSet.delete(cornerTileIds[0]);
  const firstCornerNeighbors = Array.from(neighbors.get(cornerTileIds[0]));
  grid[0][1] = firstCornerNeighbors[0];
  grid[1][0] = firstCornerNeighbors[1];
  tileSet.delete(firstCornerNeighbors[0]);
  tileSet.delete(firstCornerNeighbors[1]);
  // Do top row
  for (let i = 1; i < gridSize - 1; i++) {
    const tileNeighbors = neighbors.get(grid[0][i]);
    for (let tileID of tileNeighbors) {
      if (
        tileSet.has(tileID) &&
        (sideSet.has(tileID) || cornerSet.has(tileID))
      ) {
        grid[0][i + 1] = tileID;
        tileSet.delete(tileID);
        break;
      }
    }
  }
  // Do left column
  for (let i = 1; i < gridSize - 1; i++) {
    const tileNeighbors = neighbors.get(grid[i][0]);
    for (let tileID of tileNeighbors) {
      if (
        tileSet.has(tileID) &&
        (sideSet.has(tileID) || cornerSet.has(tileID))
      ) {
        grid[i + 1][0] = tileID;
        tileSet.delete(tileID);
        break;
      }
    }
  }
  // Now we can do the rest based on their neighbors above
  // and to the left
  for (let y = 1; y < gridSize; y++) {
    for (let x = 1; x < gridSize; x++) {
      const neighbors1 = neighbors.get(grid[y - 1][x]);
      const neighbors2 = neighbors.get(grid[y][x - 1]);
      grid[y][x] = Array.from(neighbors1)
        .filter((n) => neighbors2.has(n))
        .filter((n) => tileSet.has(n))[0];
      tileSet.delete(grid[y][x]);
    }
  }

  return grid;
};

const allPossibleRotationsAndFlips = (tile) => {
  const result = [];
  let workingTile = tile;
  result.push(workingTile);
  for (let i = 0; i < 3; i++) {
    workingTile = rotateLeft(workingTile);
    result.push(workingTile);
  }
  workingTile = flip(rotateLeft(workingTile)); // back to original and flip
  result.push(workingTile);
  for (let i = 0; i < 3; i++) {
    workingTile = rotateLeft(workingTile);
    result.push(workingTile);
  }
  return result;
};

const gridOfTiles = (gridOfIds, tileMap) => {
  const gridSize = gridOfIds.length;
  const grid = new Array(gridSize)
    .fill('')
    .map((r) => new Array(gridSize).fill(''));
  // Top left corner
  let tile = tileMap.get(gridOfIds[0][0]);
  const tileSize = tile.length;
  let edgesRight = new Set([
    ...edges(tileMap.get(gridOfIds[0][1])),
    ...edges(tileMap.get(gridOfIds[0][1])).map((t) => flipEdge(t, tileSize)),
  ]);
  let edgesBelow = new Set([
    ...edges(tileMap.get(gridOfIds[1][0])),
    ...edges(tileMap.get(gridOfIds[1][0])).map((t) => flipEdge(t, tileSize)),
  ]);
  const possibleTiles = allPossibleRotationsAndFlips(tile);
  for (let t of possibleTiles) {
    const [left, top, right, bottom] = edges(t);
    if (edgesRight.has(right) && edgesBelow.has(bottom)) {
      grid[0][0] = t;
    }
  }
  // Left side
  for (let i = 1; i < gridSize; i++) {
    // Bottom edge of tile above
    const expectedTopEdge = edges(grid[i - 1][0])[3];
    for (let t of allPossibleRotationsAndFlips(tileMap.get(gridOfIds[i][0]))) {
      const [left, top, right, bottom] = edges(t);
      if (top === expectedTopEdge) {
        grid[i][0] = t;
      }
    }
  }
  // Now the rest
  for (let j = 0; j < gridSize; j++) {
    for (let i = 1; i < gridSize; i++) {
      // Right edge of tile to the left
      const expectedLeftEdge = edges(grid[j][i - 1])[2];
      for (let t of allPossibleRotationsAndFlips(
        tileMap.get(gridOfIds[j][i]),
      )) {
        const [left, top, right, bottom] = edges(t);
        if (left === expectedLeftEdge) {
          grid[j][i] = t;
        }
      }
    }
  }
  return grid;
};

const imageFromGrid = (grid) => {
  // Construct image from all tiles in grid with borders removed
  const gridSize = grid.length;
  const tileSize = grid[0][0].length;
  const tileSizeNoBorder = tileSize - 2;
  const imageSize = tileSizeNoBorder * gridSize;
  const image = new Array(imageSize)
    .fill('')
    .map((r) => new Array(imageSize).fill(''));
  for (let j = 0; j < imageSize; j++) {
    for (let i = 0; i < imageSize; i++) {
      const grid_j = Math.floor(j / tileSizeNoBorder);
      const grid_i = Math.floor(i / tileSizeNoBorder);
      const tile_j = (j % tileSizeNoBorder) + 1;
      const tile_i = (i % tileSizeNoBorder) + 1;
      image[j][i] = grid[grid_j][grid_i][tile_j][tile_i];
    }
  }
  return image;
};

/*
                  # 
#    ##    ##    ###
 #  #  #  #  #  #   

 */
const seaMonsterIsAtThisLocation = (image, y, x) => {
  const imageSize = image.length;
  if (x > imageSize - 20) {
    return false;
  }
  if (y > imageSize - 3) {
    return false;
  }
  return (
    image[y][x + 18] === '1' &&
    image[y + 1][x] === '1' &&
    image[y + 1][x + 5] === '1' &&
    image[y + 1][x + 6] === '1' &&
    image[y + 1][x + 11] === '1' &&
    image[y + 1][x + 12] === '1' &&
    image[y + 1][x + 17] === '1' &&
    image[y + 1][x + 18] === '1' &&
    image[y + 1][x + 19] === '1' &&
    image[y + 2][x + 1] === '1' &&
    image[y + 2][x + 4] === '1' &&
    image[y + 2][x + 7] === '1' &&
    image[y + 2][x + 10] === '1' &&
    image[y + 2][x + 13] === '1' &&
    image[y + 2][x + 16] === '1'
  );
};

const numberOfSeaMonsters = (image) => {
  const imageSize = image.length;
  let count = 0;
  for (let j = 0; j < imageSize; j++) {
    for (let i = 0; i < imageSize; i++) {
      if (seaMonsterIsAtThisLocation(image, j, i)) {
        count = count + 1;
      }
    }
  }
  return count;
};

const setBits = (image) => {
  return image
    .map((r) => r.filter((c) => c === '1').reduce((a, b) => a + 1, 0))
    .reduce((a, b) => a + b, 0);
};

const part1 = (inputFilePath) => {
  const tileMap = readInput(inputFilePath);
  const neighbors = neighborMap(tileMap);
  // Only corner tiles will have 2 neighbors;
  // filter those and multiply the IDs
  const cornerTileIds = Array.from(neighbors.keys()).filter(
    (key) => neighbors.get(key).size === 2,
  );
  return cornerTileIds.reduce((a, b) => a * b, 1);
};

const part2 = (inputFilePath) => {
  const tileMap = readInput(inputFilePath);
  const neighbors = neighborMap(tileMap);
  const cornerTileIds = Array.from(neighbors.keys()).filter(
    (key) => neighbors.get(key).size === 2,
  );
  const sideTileIds = Array.from(neighbors.keys()).filter(
    (key) => neighbors.get(key).size === 3,
  );
  const gridOfIds = gridOfTileIds(tileMap);
  const grid = gridOfTiles(gridOfIds, tileMap);
  const image = imageFromGrid(grid);
  const allImages = allPossibleRotationsAndFlips(image);
  for (let im of allImages) {
    let count = numberOfSeaMonsters(im);
    if (count > 0) {
      return setBits(im) - 15 * count;
    }
  }
  return 'Failed';
};

module.exports = {
  part1,
  part2,
};
