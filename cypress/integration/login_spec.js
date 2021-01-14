describe('Login', function () {

  // TODO: Implement stubbing of the server once there is a server to stub and dgs-web is making API calls to it.

  it('sets auth cookie when logging in via form submission', function () {
    cy.visit('#/login')

    cy.get('#username').type('grdfgd')
    cy.get('#password').type(`fstgggf`)
    cy.get('#signin').click().should(() => {
      expect(localStorage.getItem('dgs-token')).to.not.be.null
    })

    cy.get('h6').should('contain', 'Disc Golf Stats')
  })

  it('logs in programmatically without using the UI', function () {
    // TODO
    // https://docs.cypress.io/guides/getting-started/testing-your-app.html#Logging-in
  })
})
