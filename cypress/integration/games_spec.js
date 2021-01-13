describe('Games page', function () {

  beforeEach(() => {
    cy.login()
  })

  it('starts a new game', function () {
    cy.visit('/games')
    cy.get('#newButton').click({ force: true })
    cy.get('#newGameButton').click()
    cy.get('#gameInputPage')
  })
})
