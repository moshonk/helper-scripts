const fs = require('fs');
const csvtojson = require('csvtojson');

// Input CSV file
const inputCsvFile = 'data.csv';

// Output JSON file
const outputJsonFile = 'data.json';

// Function to split assessment questions and return as an array
function splitAssessmentQuestions(questionsStr) {
  return questionsStr.split('\n\t').map(question => question.trim());
}

// Read CSV file and convert it to JSON
csvtojson()
  .fromFile(inputCsvFile)
  .then(jsonData => {
    // Process the jsonData to match the desired output format
    const processedJsonData = jsonData.map(data => {
      return {
        indicatorName: data['Indicator Name'],
        indicatorCode: data['PSS Insight Indicator #'],
        dataType: data['Data Type'],
        topic: data['Topic'],
        definition: data['Definition'],
        assessmentQuestions: splitAssessmentQuestions(data['Assessment Questions']),
        purposeAndIssues: data['Purpose and Issues'],
        preferredDataSources: data['Preferred Data Sources'],
        methodOfEstimation: data['Method of Estimation'],
        proposedScoring: data['Proposed Scoring or Benchmarking'],
        expectedFrequencyOfDataDissemination: data['Expected Frequency of Data Dissemination'],
        indicatorReference: data['Indicator Reference Number(s)'],
        indicatorSource: data['Indicator Source(s)'],
        url: data['URL'],
        createdBy: null,
        uuid: null,
        date: null
      };
    });

    // Save processed JSON data to output file
    fs.writeFile(outputJsonFile, JSON.stringify(processedJsonData, null, 2), (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
      } else {
        console.log('JSON file has been saved.');
      }
    });
  })
  .catch(error => {
    console.error('Error converting CSV to JSON:', error);
  });
