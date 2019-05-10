describe('Drawer', function () {
  it('navigates correctly with drawer buttons', function () {
    cy.visit('/')

    cy.contains('Games')
      .click({ force: true })
    cy.get('#gamesPage')

    cy.contains('Players')
      .click({ force: true })
    cy.get('#playersPage')

    cy.contains('Courses')
      .click({ force: true })
    cy.get('#coursesPage')

    cy.contains('Graphs')
      .click({ force: true })
    cy.get('#graphsPage')

    cy.contains('Competitions')
      .click({ force: true })
    cy.get('#competitionsPage')

    cy.contains('Info')
      .click({ force: true })
    cy.get('#infoPage')
  })

  it('navigates to new course page', function () {
    cy.visit('/courses')
    cy.get('#newButton').click({ force: true })
    // TODO: when implemented
  })
})
