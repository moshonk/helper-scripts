const fs = require('fs');

const headers = [
  "Indicator Name",
  "PSS Insight Indicator #",
  "Data Type",
  "Topic",
  "Definition",
  "Assessment Questions",
  "Purpose and Issues",
  "Preferred Data Sources",
  "Method of Estimation",
  "Proposed Scoring or Benchmarking",
  "Expected Frequency of Data Dissemination",
  "Indicator Reference Number(s)",
  "Indicator Source(s)",
  "URL"
];

function readTsvFile(filepath) {
  const data = fs.readFileSync(filepath, 'utf8');
  return data;
}

function writeCsvFile(filepath, data) {
  fs.writeFileSync(filepath, data, 'utf8');
}

function escapeSpecialChars(str) {
  return str.replace(/"/g, '""');
}

function generateCsv(data) {
  // Split the data blocks
  const rows = data.split(/(?:\r?\n){1,3}(?=Indicator Name:)/).map((row) => row.trim());

  const parsedRows = rows.map((row) => {
    const parsedRow = {};
    headers.forEach((header) => {
      const regex = new RegExp(`^${header.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')}:`, "m");
      const match = row.match(regex);
      if (match) {
        let nextHeaderIndex = row.length;
        for (const nextHeader of headers) {
          const nextHeaderMatch = row.match(new RegExp(`^${nextHeader.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')}:`, "m"));
          if (nextHeaderMatch && nextHeaderMatch.index > match.index && nextHeaderMatch.index < nextHeaderIndex) {
            nextHeaderIndex = nextHeaderMatch.index;
          }
        }
        const value = row.slice(match.index + header.length + 1, nextHeaderIndex).trim();
        parsedRow[header] = value;
      }
    });
    return parsedRow;
  });

  const csvData = [headers.join(",")];
  parsedRows.forEach((row) => {
    const values = headers.map((header) => {
      if (["Indicator Name", "Assessment Questions", "Definition", "Purpose and Issues", "Preferred Data Sources", "Method of Estimation", "Proposed Scoring or Benchmarking", "Expected Frequency of Data Dissemination", "Indicator Reference Number(s)", "Indicator Source(s)"].includes(header)) {
        return `"${escapeSpecialChars(row[header] || "")}"`;
      } else {
        return `"${row[header] || ""}"`;
      }
    });
    csvData.push(values.join(","));
  });

  return csvData.join("\n");
}

const inputFilePath = 'data.tsv';
const outputFilePath = 'data.csv';

const tsvData = readTsvFile(inputFilePath);
const csv = generateCsv(tsvData);
writeCsvFile(outputFilePath, csv);
console.log(`CSV data has been written to ${outputFilePath}`);
