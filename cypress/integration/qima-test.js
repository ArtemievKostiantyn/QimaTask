import {
  generateTestData,
  getExpectedSampleLetter,
  getResultsFromSamplePlan,
} from '../helpers/fixtureHelpers';
import { acceptableQualityLimit } from '../support/selectors';
const testData = {};

describe('Make sure aql calculator is working', () => {
  beforeEach(() => {
    generateTestData(testData);
    cy.visit('https://www.qima.com/aql-acceptable-quality-limit');
    cy.get(acceptableQualityLimit.acceptCookiesButton).should('be.visible').click();
  });

  for (let i = 0; i < 5; i++) {
    it(`QIMA ${i + 1} test`, () => {
      cy.get(acceptableQualityLimit.inputQuantityField)
        .should('be.visible')
        .type(testData.randomQuantity);
      cy.get(acceptableQualityLimit.inspectionSelectOption)
        .should('be.visible')
        .and('be.enabled')
        .select(testData.randomIndexToSelect);
      cy.get(acceptableQualityLimit.criticalAqlSelectOption)
        .should('be.visible')
        .and('be.enabled')
        .select(testData.randomAqlIndexToSelectCritical);
      getExpectedSampleLetter(testData.randomQuantity, testData.randomIndexToSelect).then(
        (expectedLetter) => {
          getResultsFromSamplePlan(testData.randomAqlIndexToSelectCritical, expectedLetter).then(
            ({ AC, RC, sampleSize }) => {
              checkFields('critical', AC, RC, sampleSize, testData);
            },
          );
        },
      );
      cy.get(acceptableQualityLimit.majorAqlSelectOption)
        .should('be.visible')
        .and('be.enabled')
        .select(testData.randomAqlIndexToSelectMajor);
      getExpectedSampleLetter(testData.randomQuantity, testData.randomIndexToSelect).then(
        (expectedLetter) => {
          getResultsFromSamplePlan(testData.randomAqlIndexToSelectMajor, expectedLetter).then(
            ({ AC, RC, sampleSize }) => {
              checkFields('major', AC, RC, sampleSize, testData);
            },
          );
        },
      );
      cy.get(acceptableQualityLimit.minorAqlSelectOption)
        .should('be.visible')
        .and('be.enabled')
        .select(testData.randomAqlIndexToSelectMinor);
      getExpectedSampleLetter(testData.randomQuantity, testData.randomIndexToSelect).then(
        (expectedLetter) => {
          getResultsFromSamplePlan(testData.randomAqlIndexToSelectMinor, expectedLetter).then(
            ({ AC, RC, sampleSize }) => {
              checkFields('minor', AC, RC, sampleSize, testData);
            },
          );
        },
      );
    });
  }
});

function checkFields(fieldName = 'critical' | 'major' | 'minor', AC, RC, sampleSize, testData) {
  cy.get('#' + fieldName + acceptableQualityLimit.acceptField)
    .should('be.visible')
    .and('have.text', AC);
  cy.get('#' + fieldName + acceptableQualityLimit.rejectField)
    .should('be.visible')
    .and('have.text', RC);
  cy.get('#' + fieldName + acceptableQualityLimit.sampleSizeField)
    .should('be.visible')
    .and(($el) => {
      expect($el.text()).to.eq(
        sampleSize >= testData.randomQuantity ? testData.randomQuantity : sampleSize,
      );
    });
}
