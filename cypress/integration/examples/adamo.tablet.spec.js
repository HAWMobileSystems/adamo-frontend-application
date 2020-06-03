/// <reference types="Cypress" />


describe('Positive Test viewport 660', () => {
  beforeEach(() => {
    cy.viewport(1000, 600);
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
  context('foward administration', () => {

    it('.url() - forward to administration if responsiv', () => {
      cy.get('.navbar-burger').click()
      cy.contains('Administration').click()
      cy.url().should('include', '/administration')
    })

    it('Test for Users', () => {
      cy.get('.tabs > ul > :nth-child(1) > a').click()

      cy.get('.tabs > ul > :nth-child(1)')
        .should('have.class', 'is-active')
    })

    it('Test for Model', () => {
      cy.get('.tabs > ul > :nth-child(2) > a').click()

      cy.get('.tabs > ul > :nth-child(2)')
        .should('have.class', 'is-active')
    })
  })
})


// it('.focus() - focus on a DOM element', () => {
//   // https://on.cypress.io/focus
//   cy.get('.action-focus').focus()
//     .should('have.class', 'focus')
//     .prev().should('have.attr', 'style', 'color: orange;')
// })

// it('.blur() - blur off a DOM element', () => {
//   // https://on.cypress.io/blur
//   cy.get('.action-blur').type('About to blur').blur()
//     .should('have.class', 'error')
//     .prev().should('have.attr', 'style', 'color: red;')
// })

// it('.clear() - clears an input or textarea element', () => {
//   // https://on.cypress.io/clear
//   cy.get('.action-clear').type('Clear this text')
//     .should('have.value', 'Clear this text')
//     .clear()
//     .should('have.value', '')
// })

// it('.submit() - submit a form', () => {
//   // https://on.cypress.io/submit
//   cy.get('.action-form')
//     .find('[type="text"]').type('HALFOFF')
//   cy.get('.action-form').submit()
//     .next().should('contain', 'Your form has been submitted!')
// })


// })