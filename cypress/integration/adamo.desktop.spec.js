/// <reference types="Cypress" />


describe('Login Test ', () => {

  before(() => {
    cy.visit('http://localhost:8085')
    cy.get('.input[formcontrolname="email"]')
      .type('daniel.hilpoltsteiner@haw-landshut.de')
    cy.get('.input[formcontrolname="password"]')
      .type('12345678')
    cy.get('button').contains('Login').click();
  });

  after(() => {
    cy.get('.logout').click()
  });

  context('foward administration', () => {

    it('.url() - forward to administration is available on admin User', () => {
      // cy.get('.navbar-burger').click()
      cy.contains('Administration').click();
      cy.url().should('include', '/administration');
    });

    it('Test for Users', () => {
      cy.get('.tabs > ul > :nth-child(1) > a').click();

      cy.get('.tabs > ul > :nth-child(1)')
        .should('have.class', 'is-active');
    });

    it('Test for Model', () => {
      cy.get('.tabs > ul > :nth-child(2) > a').click();

      cy.get('.tabs > ul > :nth-child(2)')
        .should('have.class', 'is-active');
    });
  });

  context('test model open', () => {

    it('.() - open sample model', () => {
      // cy.get('.navbar-burger').click()
      cy.contains('+').click();
      cy.get('.is-grouped > :nth-child(2) > .button').should('not.exist');
      cy.wait(100);
      cy.get(':nth-child(3) > tr > :nth-child(1)').click();
      cy.get('.is-grouped > :nth-child(2) > .button').should('exist').click();
      cy.url().should('include', '/model');
      cy.get('.navbar-start > .navbar-item > :nth-child(1)').should('exist');
    });

    it('.() - close model', () => {

      cy.get('.navbar-start > .navbar-item > :nth-child(1)').should('exist');
      cy.get('.close').click();

      cy.get('.navbar-start > .navbar-item > :nth-child(1)').should('not.exist');
      cy.url().should('include', '/overview/dashboard');
    });
  });
});

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