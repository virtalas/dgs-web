describe('Course page', function () {

  beforeEach(() => {
    cy.login()
    cy.visit('#/courses')
    cy.get('[data-cy=courseCard]:first').click({ force: true })
  })

  it('lists info', () => {
    cy.get('#courseImage')
    cy.get('#courseNameCity')
    cy.get('[data-cy=layoutPaper]:first')
  })

  it('edits course info', () => {
    cy.get('#editCourseButton').click()
    cy.get('[data-cy=courseNameInput]').type('edit1')
    cy.get('[data-cy=courseCityInput]').type('edit2')
    cy.get('#submitCourseButton').click()
    cy.get('#courseNameCity').should('contain', 'edit1')
    cy.get('#courseNameCity').should('contain', 'edit2')
  })

  it('edits layout info', () => {
    cy.get('[data-cy=editLayoutButton]:first').click()
    cy.get('#layoutNameInput').type('edit1')
    cy.get('#layoutDescInput').type('edit2')
    cy.get('#submitLayoutButton').click()
    cy.get('[data-cy=layoutName]:first').should('contain', 'edit1')
    cy.get('[data-cy=layoutDesc]:first').should('contain', 'edit2')
  })
})
