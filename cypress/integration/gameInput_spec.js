describe('Inputting a new game', function () {
  beforeEach(function () {
    cy.login()
    cy.visit('/games')
    cy.get('#newButton').click({ force: true })
    cy.get('#newGameButton').click()
  })

  it('saves inputted game info when moving between tabs', () => {
    cy.get('[class=MuiHook-strokeInput]').eq(1).type(3)

    cy.get('#gameInfoTabButton').click()
    cy.get('[data-cy=playerStroke').should('contain', '3')
    cy.get('#commentEdit').type('Ace run on hole 1.')
    cy.get('[data-cy=weatherConditionChip]:first').should('have.class', 'MuiChip-outlined')
    cy.get('[data-cy=weatherConditionChip]:first').click()

    cy.get('#scoresTabButton').click()

    cy.get('#gameInfoTabButton').click()
    cy.get('#commentEdit').should('contain', 'Ace run on hole 1.')
    cy.get('[data-cy=weatherConditionChip]:first').should('not.have.class', 'MuiChip-outlined')
  })
  
  it('inputs ob', function () {
    cy.get('[class=MuiHook-strokeInput]:first').type(2)
    cy.get('[class=MuiHook-strokeInput]:first').should('have.value', '2')
    cy.get('[class=MuiHook-strokeInput]').eq(1).type(3)
    cy.get('[class=MuiHook-strokeInput]').eq(1).should('have.value', '3')
  })

  it('inputs strokes', function () {
    cy.get('[class=MuiHook-strokeInput]').eq(1).type(3)
    cy.get('[class=MuiHook-strokeInput]').eq(1).should('have.value', '3')
  })

  it('updates "to par"', function () {
    cy.get('[data-cy=toPar]:first').should('contain', '0')
    cy.get('[class=MuiHook-strokeInput]').eq(1).type(3)
    cy.get('[data-cy=toPar]:first').should('contain', '0') // Assume par 3
    cy.get('[class=MuiHook-strokeInput]').eq(1).type(4)
    cy.get('[data-cy=toPar]:first').should('contain', '+1')
    cy.get('[class=MuiHook-strokeInput]').eq(1).type(2)
    cy.get('[data-cy=toPar]:first').should('contain', '-1')
  })
  
  it('changes to previous or next hole', function () {
    cy.get('[data-cy=previousHole]').click()
    cy.get('#infoBarHoleNumber').should('contain', '1')

    cy.get('[data-cy=nextHole]').click()
    cy.get('#infoBarHoleNumber').should('contain', '2')

    cy.get('[data-cy=previousHole]').click()
    cy.get('#infoBarHoleNumber').should('contain', '1')
  })

  it('inputs par', function () {
    cy.get('[data-cy=parCircleButton]').click()
    cy.get('[class=MuiHook-strokeInput]').eq(1).should('have.value', '3') // Assume par 3
  })

  it('navigates between tabs', function () {
    cy.get('#gameInfoTabButton').click()
    cy.get('#gameInfoView')
    
    cy.get('#statsTabButton').click()
    cy.get('#holeInfoView')
    
    cy.get('#mapTabButton').click()
    cy.get('#mapView')

    cy.get('#scoresTabButton').click()
    cy.get('#scoresInputView')
  })

  it('submits game and redirects to /games', () => {
    cy.get('#gameInfoTabButton').click()
    cy.get('#finishGameButton').click()
    cy.contains('Disc Golf Stats')
  })
})
