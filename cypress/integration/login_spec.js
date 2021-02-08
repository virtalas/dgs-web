const sign = require('jwt-encode')

import { API_ROOT } from '../../src/apiConfig'

describe('Login', () => {

  it('sets auth cookie when logging in via form submission', function () {
    cy.intercept('POST', `${API_ROOT}/authentication/login/password`, {
      body: {
        access_token: sign({'sub': 'golfer@email.com', 'exp': 9999999}, 'abc')
      }
    })

    cy.visit('#/login')

    cy.get('#email').type('golfer@email.com')
    cy.get('#password').type('password')
    cy.get('#signin').click().should(() => {
      expect(localStorage.getItem('dgs-token')).to.not.be.null
    })

    cy.get('h6').should('contain', 'Disc Golf Stats')
  })

  it('logs in programmatically without using the UI', function () {
    cy.intercept('POST', `${API_ROOT}/authentication/login/password`, {
      body: {
        access_token: sign({'sub': 'golfer@email.com', 'exp': 9999999}, 'abc')
      }
    })

    cy.visit('/', {
      onBeforeLoad (win) {
        win.localStorage.setItem('dgs-token', JSON.stringify({
          access_token: sign({'sub': 'golfer@email.com', 'exp': 9999999}, 'abc')
        }))
      },
    })

    cy.get('h6').should('contain', 'Disc Golf Stats')
  })

  it('displays error for invalid credentials', () => {
    cy.intercept('POST', `${API_ROOT}/authentication/login/password`, {
      statusCode: 401,
    })

    cy.visit('/')

    cy.get('#email').type('golfer@email.com')
    cy.get('#password').type('wrongpassword')
    cy.get('#signin').click()

    cy.contains('invalid email or password')
  })
})

describe('Registering', () => {

  it('successfully registers a new user and logs in', () => {
    cy.intercept('POST', `${API_ROOT}/users`, {
      body: {
        id: 'isjl39j0saeks',
      }
    })
    const payload = {'sub': 'golfer@email.com', 'exp': 9999999}
    cy.intercept('POST', `${API_ROOT}/authentication/login/password`, {
      body: {
        access_token: sign(payload, 'abc')
      }
    })

    cy.visit('#/login')
    cy.get('a[href*="register"]').click()
  
    cy.get('#email').type('golfer@email.com')
    cy.get('#firstName').type('Teppo')
    cy.get('#lastName').type('Tulppu')
    cy.get('#password').type('password')
    cy.get('#signup').click()
  })

  it('displays error for existing account', () => {
    cy.intercept('POST', `${API_ROOT}/users`, {
      statusCode: 409,
    })

    cy.visit('#/register')
    cy.get('#email').type('golfer@email.com')
    cy.get('#firstName').type('Teppo')
    cy.get('#lastName').type('Tulppu')
    cy.get('#password').type('password')
    cy.get('#signup').click()

    cy.contains('This email has already been registered')
  })

  it('displays errors for invalid input', () => {
    cy.visit('#/register')
    cy.get('#email').type('golfer')
    cy.get('#firstName').focus().blur()
    cy.get('#lastName').focus().blur()
    cy.get('#password').type('passw')
    cy.get('#signup').click()

    cy.get('div:contains(Required)')
    cy.contains('Password is too short')
  })
})
