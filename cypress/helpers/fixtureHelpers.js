const possibleLetters = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'j',
  'k',
  'l',
  'm',
  'n',
  'p',
  'q',
  'r',
];
const inspectionLevelsArray = ['I', 'II', 'III', 'S1', 'S2', 'S3', 'S4'];
const aqlLevelsArray = [
  '0.065',
  '0.10',
  '0.15',
  '0.25',
  '0.40',
  '0.65',
  '1.0',
  '1.5',
  '2.5',
  '4.0',
  '6.5',
];

export function generateTestData(testDataObj) {
  testDataObj['randomQuantity'] = Math.floor(Math.random() * 800000);
  testDataObj['randomIndexToSelect'] =
    inspectionLevelsArray[Math.floor(Math.random() * inspectionLevelsArray.length)];
  testDataObj['randomAqlIndexToSelectCritical'] =
    aqlLevelsArray[Math.floor(Math.random() * aqlLevelsArray.length)];
  testDataObj['randomAqlIndexToSelectMajor'] =
    aqlLevelsArray[Math.floor(Math.random() * aqlLevelsArray.length)];
  testDataObj['randomAqlIndexToSelectMinor'] =
    aqlLevelsArray[Math.floor(Math.random() * aqlLevelsArray.length)];
}

export function getResultsFromSamplePlan(aql, sampleLetter) {
  return cy.fixture('samplePlan').then((planFixture) => {
    const sampleLetterIndex = possibleLetters.indexOf(sampleLetter.toLowerCase());
    expect(sampleLetterIndex).to.not.equal(-1);
    const aqlColumn = planFixture[aql];
    expect(aqlColumn).to.not.be.undefined;
    for (const x of Object.keys(aqlColumn).sort()) {
      if (sampleLetterIndex <= possibleLetters.indexOf(x.toLowerCase())) {
        return aqlColumn[x];
      }
    }
  });
}

export function getExpectedSampleLetter(quantity, inspectionLevel) {
  return cy.fixture('sampleSizeCode').then((sampleSizeCodeFixture) => {
    for (const x of Object.keys(sampleSizeCodeFixture)) {
      if (x.includes('to')) {
        const range = x.match(/\d+/g);
        if (quantity >= Number(range[0]) && quantity <= Number(range[1])) {
          return sampleSizeCodeFixture[x][inspectionLevel];
        }
      } else {
        if (quantity >= Number(x)) {
          return sampleSizeCodeFixture[x][inspectionLevel];
        }
      }
    }
  });
}
