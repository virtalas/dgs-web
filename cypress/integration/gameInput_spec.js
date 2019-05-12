describe('Inputting a new game', function () {
  beforeEach(function () {
    cy.visit('/games')
    cy.get('#newButton').click({ force: true })
    cy.contains('Start a new game').click()
  })
  
  it('inputs strokes', function () {
    // cy.get('[class^=Hook-strokeInput]:first').type(2)
  })
  
  it('inputs obs', function () {
    // TODO
  })
  
  it('changes to previous or next hole', function () {
    // TODO
  })

  it('inputs par', function () {
    // TODO
  })

  it('navigates between tabs', function () {
    // TODO
  })
})
