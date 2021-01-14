describe('Drawer', function () {

  beforeEach(() => {
    cy.login()
    cy.visit('#/courses')
  })

  it('lists courses', () => {
    cy.get('[data-cy=courseCard]:first')
  })

  it('creates a course with valid input', () => {
    cy.get('#newButton').click({ force: true })
    cy.get('#newCourseButton').click({ force: true })
    cy.get('#submitCourseButton').should('be.disabled')
    cy.get('[data-cy=courseNameInput]').type('Mountain madness')
    cy.get('[data-cy=courseCityInput]').type('Colorado')
    cy.get('#submitCourseButton').click()
    cy.get('#editLayout')
  })

  it('creates a layout with valid input', () => {
    cy.get('#newButton').click({ force: true })
    cy.get('#newLayoutButton').click({ force: true })
    cy.get('#submitLayoutButton').should('be.disabled')
    cy.get('#layoutNameInput').type('Winter layout')
    cy.get('#submitLayoutButton').click()
    cy.get('[data-cy=courseCard]:first') // Redirected to /courses
  })
})
