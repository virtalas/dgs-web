describe('Players page', function () {

  beforeEach(() => {
    cy.login()
    cy.visit('#/players')
  })

  it('lists players', () => {
    cy.get('#playersPage')
    cy.get('[data-cy=playerCard]:first')
  })

  it('lists player high scores', () => {
    cy.get('[data-cy=highScoresButton]:first').click()
    cy.get('[data-cy=highScoresTable]')
  })

  it('redirects to a game associated with given high score', () => {
    cy.get('[data-cy=highScoresButton]:first').click()
    cy.get('[data-cy=highScoresTable]')
    cy.get('[data-cy=highScoreGameButton]:first').click()
    cy.get('[data-cy=gameCard]')
  })
})
