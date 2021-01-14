describe('Inputting a new game', function () {

  // Note.
  // { force: true } is added to fix an issue of tests randomly failing:
  // https://github.com/cypress-io/cypress/issues/5830

  beforeEach(function () {
    cy.login()
    cy.visit('#/games')
    cy.get('#newButton').click({ force: true })
    cy.get('#newGameButton').click({ force: true })
  })

  it('saves inputted game info when moving between tabs', () => {
    cy.get('[class=MuiHook-strokeInput]').eq(1).type(3, { force: true })

    cy.get('#gameInfoTabButton').click({ force: true })
    cy.get('[data-cy=playerStroke').should('contain', '3')
    cy.get('#commentEdit').type('Ace run on hole 1.', { force: true })
    cy.get('[data-cy=weatherConditionChip]:first').should('have.class', 'MuiChip-outlined')
    cy.get('[data-cy=weatherConditionChip]:first').click({ force: true })

    cy.get('#scoresTabButton').click({ force: true })

    cy.get('#gameInfoTabButton').click({ force: true })
    cy.get('#commentEdit').should('contain', 'Ace run on hole 1.')
    cy.get('[data-cy=weatherConditionChip]:first').should('not.have.class', 'MuiChip-outlined')
  })
  
  it('inputs ob', function () {
    cy.get('[class=MuiHook-strokeInput]:first').type(2, { force: true })
    cy.get('[class=MuiHook-strokeInput]:first').should('have.value', '2')
    cy.get('[class=MuiHook-strokeInput]').eq(1).type(3, { force: true })
    cy.get('[class=MuiHook-strokeInput]').eq(1).should('have.value', '3')
  })

  it('inputs strokes', function () {
    cy.get('[class=MuiHook-strokeInput]').eq(1).type(3, { force: true })
    cy.get('[class=MuiHook-strokeInput]').eq(1).should('have.value', '3')
  })

  it('updates "to par"', function () {
    cy.get('[data-cy=toPar]:first').should('contain', '0')
    cy.get('[class=MuiHook-strokeInput]').eq(1).type(3, { force: true })
    cy.get('[data-cy=toPar]:first').should('contain', '0') // Assume par 3
    cy.get('[class=MuiHook-strokeInput]').eq(1).type(4, { force: true })
    cy.get('[data-cy=toPar]:first').should('contain', '+1')
    cy.get('[class=MuiHook-strokeInput]').eq(1).type(2, { force: true })
    cy.get('[data-cy=toPar]:first').should('contain', '-1')
  })
  
  it('changes to previous or next hole', function () {
    cy.get('[data-cy=previousHole]').click({ force: true })
    cy.get('#infoBarHoleNumber').should('contain', '1')

    cy.get('[data-cy=nextHole]').click({ force: true })
    cy.get('#infoBarHoleNumber').should('contain', '2')

    cy.get('[data-cy=previousHole]').click({ force: true })
    cy.get('#infoBarHoleNumber').should('contain', '1')
  })

  it('inputs par', function () {
    cy.get('[data-cy=parCircleButton]').click({ force: true })
    cy.get('[class=MuiHook-strokeInput]').eq(1).should('have.value', '3') // Assume par 3
  })

  it('navigates between tabs', function () {
    cy.get('#gameInfoTabButton').click({ force: true })
    cy.get('#gameInfoView')
    
    cy.get('#statsTabButton').click({ force: true })
    cy.get('#holeInfoView')
    
    cy.get('#mapTabButton').click({ force: true })
    cy.get('#mapView')

    cy.get('#scoresTabButton').click({ force: true })
    cy.get('#scoresInputView')
  })

  it('submits game and redirects to /games', () => {
    cy.get('#gameInfoTabButton').click({ force: true })
    cy.get('#finishGameButton').click({ force: true })
    cy.contains('Disc Golf Stats')
  })
})
