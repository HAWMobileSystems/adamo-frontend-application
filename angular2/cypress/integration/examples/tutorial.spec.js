/// <reference types="cypress" />

import Chance from 'chance';
const chance = new Chance();



describe('Firestarter', () => {

    // Correct Login Informations 
    const emailLogin = 'demo@demo.de';
    const passLogin = '123456789';

    const emailWrong = 'test@test.de'
    const passWrong = '123123123'

    // Start front end
    const waitingTimeLong = 1000;
    const waitingTimeMiddle = 500;
    const waitingTimeShort = 250;

    Cypress.Commands.add('validateIntroductionPages', () => {
        cy.wait(500);
        cy.get('app-introduction > div > .btn-toolbar').children().should('have.length',3);
        cy.get('app-introduction > div > .btn-toolbar').children().eq(0).contains('Previous')
        cy.get('app-introduction > div > .btn-toolbar').children().eq(1).contains('Next');
        cy.get('#btnCancel');
    
        // Validate Table header for content - EN 
        cy.get(':nth-child(1) > p > strong').contains('NOTATION');
        cy.get(':nth-child(2) > p > strong').contains('ELEMENT NAME');
        cy.get(':nth-child(3) > p > strong').contains('DESCRIPTION');
        cy.get(':nth-child(4) > p > strong').contains('BEST PRACTICE');
    
        // Validate Table second row for content - EN
        cy.get('tbody > :nth-child(2) > :nth-child(1)').should('not.be.empty');
        cy.get('tbody > :nth-child(2) > :nth-child(2)').should('not.be.empty');
        cy.get('tbody > :nth-child(2) > :nth-child(3)').should('not.be.empty');
        cy.get('tbody > :nth-child(2) > :nth-child(4)').should('not.be.empty');
    
        // Switch language from en to de
        cy.get('select').select('en').should('have.value', 'en');
        cy.get('select').select('de').should('have.value', 'de');
        cy.wait(waitingTimeMiddle);
    
        cy.get('app-introduction > div > .btn-toolbar').children().should('have.length',3);
        cy.get('app-introduction > div > .btn-toolbar').children().eq(0).contains('Previous')
        cy.get('app-introduction > div > .btn-toolbar').children().eq(1).contains('Next');
        cy.get('#btnCancel');
    
        // Validate Table header for content - DE
        cy.get(':nth-child(1) > p > strong').contains('NOTATION');
        cy.get(':nth-child(2) > p > strong').contains('ELEMENT NAME');
        cy.get(':nth-child(3) > p > strong').contains('BESCHREIBUNG');
        cy.get(':nth-child(4) > p > strong').contains('BEST PRACTICE');
    
        // Validate Table second row for content - DE
        cy.get('tbody > :nth-child(2) > :nth-child(1)').should('not.be.empty');
        cy.get('tbody > :nth-child(2) > :nth-child(2)').should('not.be.empty');
        cy.get('tbody > :nth-child(2) > :nth-child(3)').should('not.be.empty');
        cy.get('tbody > :nth-child(2) > :nth-child(4)').should('not.be.empty');
    
        // Back to language EN
        cy.get('select').select('en').should('have.value', 'en');
        cy.wait(waitingTimeMiddle);
    
        // Got to next page 
        cy.get('#btnNext').click();
      });
    

    before(() => {
        //cy.exec('npm run serve')
        cy.visit('http://localhost:8085')
        cy.get('input[formcontrolname=email]').type(emailLogin);
        cy.get('input[formcontrolname=password]').type(passLogin);
        cy.contains('Login').click();
        cy.wait(1000);
        // Click 'Tutorial' in Menu
        cy.get('.navbar-burger').click()
        cy.wait(waitingTimeMiddle)
        cy.get('.navbar-menu').contains('Tutorial').click();
        cy.wait(1000);
    })

    // Check title
    it.skip('Check for title',() => {
        cy.contains('DAMO');
        expect(2).to.equal(2)
    });

    // Logging in again after clicking on "DAMO" Icon
    it.skip('Click "DAMO-Icon', () => {
        cy.contains('DAMO').click();

        // Login again'
        cy.get('input[formcontrolname=email]').type(emailLogin);
        cy.get('input[formcontrolname=password]').type(passLogin);
        cy.contains('Login').click();
        cy.wait(1000);

        // click "Tutorial" Menubar-Option again'
        cy.get('.navbar-burger').click()
        cy.get('.navbar-menu').contains('Tutorial').click();
    });

    // CAUTION: DO NOT SKIP!!!
    //--- Testing order of expansion-panel items BPMN for Beginner, BPMN for Advanced and BPMN for Professional
    // RETURN: FALSE --- Because order is incorrect
    it.skip('Getting the first element in mat-expension-panel: Should be "Professional"', () => {
        cy.wait(500);
        cy.get('.container > .mat-accordion > .ng-star-inserted').eq(2).should('contain','BPMN for Beginner');
        // Getting the first element in mat-expension-panel: Should be "Advanced
        cy.get('.container > .mat-accordion > .ng-star-inserted').eq(1).should('contain','BPMN for Advanced');
        //Getting the first element in mat-expension-panel: Should be "Beginner
        cy.get('.container > .mat-accordion > .ng-star-inserted').eq(0).should('contain','BPMN for Professional');
    });

    // --- Clicking on Element "BPMN for Beginner and checking order of elements"
    it.skip('Clicking on Element BPMN for Beginner', () => {
        // Button "BPMN for Beginner" --- chlick
        cy.contains('BPMN for Beginner').click();
            // Button "Introduction into Beginner" --- check
            //cy.get('.container > .mat-accordion > .ng-star-inserted').eq(2).children().find('.submodule').eq(0).should('contain','Introduction into Beginner');
            cy.get('#cdk-accordion-child-4 > :nth-child(1) > :nth-child(1) > .row > .col > a.ng-star-inserted')
            // Button "Test your knowlege of the Beginner'" --- check
            cy.get('.container > .mat-accordion > .ng-star-inserted').eq(2).children().find('.submodule').eq(1).should('contain','Test your knowlege of the Beginner');
        // Button "BPMN Modelling" --- check
        cy.get('.container > .mat-accordion > .ng-star-inserted').eq(2).children().find('.mat-expansion-panel > mat-expansion-panel-header > span').eq(0).should('contain','BPMN Modelling'); 
    });

    // BPMN Beginner -> BPMN Modelling
    it.skip('Clicking on BPMN Beginner -> BPMN Modelling ', () => {
        cy.get('#mat-expansion-panel-header-4 > .mat-content').click();
        //cy.get('.container > .mat-accordion > .ng-star-inserted').eq(2).children().find('.mat-expansion-panel > mat-expansion-panel-header > span').eq(0).should('contain','BPMN Modelling').click();
        cy.get('.container > .mat-accordion > .ng-star-inserted').eq(2).children().find('.mat-expansion-panel').eq(0).children().should('contain','BPMN Modelling').find('.mat-expansion-panel-body').children().should('have.length',11);
    });



    // BPMN Beginner - Introduction into Beginner - Check
    it('BPMN Beginner -> BPMN for Beginner -> Introduction into Beginner', () => {
        // Clicking anker 'Introduction into Beginner'
        cy.wait(500);
        // Button "BPMN for Beginner" --- chlick
        cy.contains('BPMN for Beginner').click();
        cy.get('.container > .mat-accordion > .ng-star-inserted').eq(2).children().find('.submodule').eq(0).children().find('a').should('contain','Introduction into Beginner').click();    
        cy.get('app-introduction > div > .btn-toolbar').children().should('have.length',3);
        cy.get('app-introduction > div > .btn-toolbar').children().eq(0).contains('Previous')
        cy.get('app-introduction > div > .btn-toolbar').children().eq(1).contains('Next');
        cy.get('#btnCancel');

        // Validate Table header for content - EN 
        cy.get(':nth-child(1) > p > strong').contains('NOTATION');
        cy.get(':nth-child(2) > p > strong').contains('ELEMENT NAME');
        cy.get(':nth-child(3) > p > strong').contains('DESCRIPTION');
        cy.get(':nth-child(4) > p > strong').contains('BEST PRACTICE');

        // Validate Table second row for content - EN
        cy.get('tbody > :nth-child(2) > :nth-child(1)').should('not.be.empty');
        cy.get('tbody > :nth-child(2) > :nth-child(2)').should('not.be.empty');
        cy.get('tbody > :nth-child(2) > :nth-child(3)').should('not.be.empty');
        cy.get('tbody > :nth-child(2) > :nth-child(4)').should('not.be.empty');

        // Switch language from en to de
        cy.get('select').select('en').should('have.value', 'en');
        cy.get('select').select('de').should('have.value', 'de');
        cy.wait(waitingTimeMiddle);

        cy.get('app-introduction > div > .btn-toolbar').children().should('have.length',3);
        cy.get('app-introduction > div > .btn-toolbar').children().eq(0).contains('Previous')
        cy.get('app-introduction > div > .btn-toolbar').children().eq(1).contains('Next');
        cy.get('#btnCancel');

        // Validate Table header for content - DE
        cy.get(':nth-child(1) > p > strong').contains('NOTATION');
        cy.get(':nth-child(2) > p > strong').contains('ELEMENT NAME');
        cy.get(':nth-child(3) > p > strong').contains('BESCHREIBUNG');
        cy.get(':nth-child(4) > p > strong').contains('BEST PRACTICE');

        // Validate Table second row for content - DE
        cy.get('tbody > :nth-child(2) > :nth-child(1)').should('not.be.empty');
        cy.get('tbody > :nth-child(2) > :nth-child(2)').should('not.be.empty');
        cy.get('tbody > :nth-child(2) > :nth-child(3)').should('not.be.empty');
        cy.get('tbody > :nth-child(2) > :nth-child(4)').should('not.be.empty');

        // Back to language EN
        cy.get('select').select('en').should('have.value', 'en');
        cy.wait(waitingTimeMiddle);

        // Go to page 2
        cy.get('#btnNext').click();

        //Go to page 3
        cy.log('Go to page 3')
        cy.validateIntroductionPages();
        //Go to page 4
        cy.log('Go to page 4')
        cy.validateIntroductionPages();
        //Go to page 5
        cy.log('Go to page 5')
        cy.validateIntroductionPages();
        //Go to page 6
        cy.log('Go to page 6')
        cy.validateIntroductionPages();
        //Go to page 7
        cy.log('Go to page 7')
        cy.validateIntroductionPages();
        //Go to page 8
        cy.log('Go to page 8')
        cy.validateIntroductionPages();
        //Go to page 9
        cy.log('Go to page 9')
        cy.validateIntroductionPages();
        //Go to page 10
        cy.log('Go to page 10')
        cy.validateIntroductionPages();
        //Go to page 11
        cy.log('Go to page 11')
        cy.validateIntroductionPages();
        //Go to page 12
        cy.log('Go to page 12')
        cy.validateIntroductionPages();
        //Go to page 13
        cy.log('Go to page 13')
        cy.validateIntroductionPages();
        
    });



});