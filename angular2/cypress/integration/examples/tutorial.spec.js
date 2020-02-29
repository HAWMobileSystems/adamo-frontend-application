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
    

    before(() => {
        //cy.exec('npm run serve')
        cy.visit('http://localhost:8085')
        cy.get('input[formcontrolname=email]').type(emailLogin);
        cy.get('input[formcontrolname=password]').type(passLogin);
        cy.contains('Login').click();
        cy.wait(500);
    })

    // it('Check for title',() => {
    //     cy.contains('DAMO');
    //     expect(2).to.equal(2)
    // });

    it('click "Tutorial" Menubar', () => {
        cy.get('.navbar-burger').click()
        cy.get('.navbar-menu').contains('Tutorial').click();
        cy.wait(1000);
        
        //cy.contains('Advanced').click();
        // cy.contains('BPMN for Beginner').click();
        // cy.contains('BPMN for Beginner').click();
    });



    //Testing "Tutorial" button to get back to start page of adamo
    // it('Click "Tutorial" in navbar', () => {
    //     cy.contains('DAMO').click();
    // });

    // it('Login again', () => {
    //     cy.get('input[formcontrolname=email]').type(emailLogin);
    //     cy.get('input[formcontrolname=password]').type(passLogin);
    //     cy.contains('Login').click();
    //     cy.wait(500);
    // });

    // it('click "Tutorial" Menubar-Option again', () => {
    //     cy.get('.navbar-burger').click()
    //     cy.get('.navbar-menu').contains('Tutorial').click();
    // });


    // --- Testing order of expansion-panel items BPMN for Beginner, BPMN for Advanced and BPMN for Professional
    // // RETURN: FALSE --- Because order is incorrect
    // it('Getting the first element in mat-expension-panel: Should be "Professional"', () => {
    //     cy.wait(500);
    //     cy.get('.container > .mat-accordion > .ng-star-inserted').eq(0).should('contain','BPMN for Beginner');
    // });
    // it('Getting the first element in mat-expension-panel: Should be "Advanced"', () => {
    //     //cy.wait(500);
    //     cy.get('.container > .mat-accordion > .ng-star-inserted').eq(1).should('contain','BPMN for Advanced');
    // });
    // // RETURN: FALSE --- Because order is incorrect
    // it('Getting the first element in mat-expension-panel: Should be "Beginner"', () => {
    //     //cy.wait(500);
    //     cy.get('.container > .mat-accordion > .ng-star-inserted').eq(2).should('contain','BPMN for Professional');
    // });

    // --- Clicking on Element "BPMN for Beginner and checking order of elements"
    it('Clicking on Element BPMN for Beginner', () => {
        // Button "BPMN for Beginner" --- chlick
        cy.contains('BPMN for Beginner').click();
            // Button "Introduction into Beginner" --- check
            cy.get('.container > .mat-accordion > .ng-star-inserted').eq(2).children().find('.submodule').eq(0).should('contain','Introduction into Beginner');
            // Button "Test your knowlege of the Beginner'" --- check
            cy.get('.container > .mat-accordion > .ng-star-inserted').eq(2).children().find('.submodule').eq(1).should('contain','Test your knowlege of the Beginner');
        // Button "BPMN Modelling" --- check
        cy.get('.container > .mat-accordion > .ng-star-inserted').eq(2).children().find('.mat-expansion-panel > mat-expansion-panel-header > span').eq(0).should('contain','BPMN Modelling');
    
        
    });

    it('Clicking on BPMN Beginner -> BPMN Modelling ', () => {
        cy.get('.container > .mat-accordion > .ng-star-inserted').eq(2).children().find('.mat-expansion-panel > mat-expansion-panel-header > span').eq(0).should('contain','BPMN Modelling').click();
        cy.get('.container > .mat-accordion > .ng-star-inserted').eq(2).children().find('.mat-expansion-panel').eq(0).children().should('contain','BPMN Modelling').find('.mat-expansion-panel-body').children().should('have.length',11);
    });

    it('Clicking into BPMN Beginner -> BPMN Modelling', () => {
        cy.get('.container > .mat-accordion > .ng-star-inserted').eq(2).children().find('.submodule').eq(0).should('contain','Introduction into Beginner').click();    
    });


    // it('block protected routes', () => {
    //     // cy.pause();
    //     cy.get('#navToogle').click();
    //     cy.contains('Firestore').click;

    //     cy.get('notfication-message').children()
    //         .should('contain', 'You must be logged in')
    //         .and('be.visible');
    // });



});