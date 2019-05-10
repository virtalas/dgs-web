describe('Games page', function () {
  it('starts a new game', function () {
    cy.visit('/games')
    cy.get('#newButton').click({ force: true })
    cy.get('#newGamePage')
    cy.contains('Start a new game').click()
    cy.contains('game was synced')
  })
})
