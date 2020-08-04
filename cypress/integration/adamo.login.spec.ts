/// <reference types="Cypress" />

describe('Login Test ', () => {

  beforeEach(() => {
    cy.viewport(1920 , 1080);
  })
  context('login', () => {
    it('.visit() - localhost:8085', () => {
      cy.visit('http://localhost:8085')
    })

    it('.type() - input email', () => {
      cy.get('.input[formcontrolname="email"]')
        .type('daniel.hilpoltsteiner@haw-landshut.de')
        .should('have.value', 'daniel.hilpoltsteiner@haw-landshut.de')
    })

    it('.type() - input password', () => {
      cy.get('.input[formcontrolname="password"]')
        .type('12345678')
        .should('have.value', '12345678')
    })

    it('.click() - submit login form', () => {
      cy.get('button').contains('Login').click()
      cy.url().should('include', '/overview/dashboard')
    })

  })

})

