const fs = require('fs');
const path = require('path');

function parseDataset(dataset) {
  const blocks = dataset.split(/\n{2,}/);
  const parsedData = blocks.map(block => {
    const lines = block.split('\n');
    const blockData = {};

    lines.forEach(line => {
      const separatorIndex = line.indexOf(':');
      const key = line.slice(0, separatorIndex).trim().toLowerCase().replace(/ /g, '_');
      const value = line.slice(separatorIndex + 1).trim();
      if (key) {
        if (blockData[key]) {
          if (!Array.isArray(blockData[key])) {
            blockData[key] = [blockData[key]];
          }
          blockData[key].push(value);
        } else {
          blockData[key] = value;
        }
      }
    });

    return blockData;
  });

  return parsedData;
}

const inputFile = path.join(__dirname, 'data.tsv');
fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  const jsonData = parseDataset(data);
  console.log(jsonData);
});
