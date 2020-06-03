/// <reference types="cypress" />

describe('Firestarter', () => {

    // Correct Login Informations 
    const emailLogin = 'demo@demo.de';
    const passLogin = '123456789';

    const emailWrong = 'test@test.de'
    const passWrong = '123123123'

    // Start front end
    const waitingTimeUltra = 1500;
    const waitingTimeLong = 1000;
    const waitingTimeMiddle = 500;
    const waitingTimeShort = 250;

    var pageCounter = 2;

// - - - - - TESTING MC - - - - - 

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


    // --- MC - Beginner ---
    it('MC - Beginner', () => {
        var questionCounter = 1;
        var min = 0;
        var max = 2;
        var randomAnswerNumber = 0;

        // Clicking anker 'Introduction into Beginner'
        cy.wait(waitingTimeLong);
        // Button "BPMN for Beginner" --- click
        cy.contains('BPMN for Beginner').click();

        cy.log('Click Test your knowlege of the Beginner');
        cy.get('#cdk-accordion-child-0 > :nth-child(1) > :nth-child(2) > .row > .col > .ng-star-inserted').click();

        cy.log('Language: EN')
        cy.get('select').select('en').should('have.value', 'en');

        for(var i = 1; i < 8; i++){
            cy.log('RandomNR: ' +randomAnswerNumber);

            cy.log('Validate: Question: '+i);
            cy.get('.question-padding > div > p').should('not.be.empty');

            cy.get('.answerblock > .ng-star-inserted > .answer-padding')
            randomAnswerNumber = Math.floor(Math.random() * (max - min)) + min;
            cy.log('Tick checkbox');
            cy.get('.answerblock > .ng-star-inserted > .answer-padding > input').eq(randomAnswerNumber).check();

            cy.log('Validate: Button Validate')
            cy.get('.btn-group').contains('Validate').click();
            cy.wait(waitingTimeLong);
        

            cy.log('Validate: Next');
            cy.get('#nextButton').click();
            cy.wait(waitingTimeLong)
        }

        cy.log('Language: EN -> DE')
        cy.get('select').select('de').should('have.value', 'de');
        cy.wait(waitingTimeMiddle)

        for(var i = 1; i < 8; i++){
            randomAnswerNumber = Math.floor(Math.random * (max - min+1)) + min

            cy.log('Validate: Question: '+i);
            cy.get('.question-padding > div > p').should('not.be.empty');

            cy.get('.answerblock > .ng-star-inserted > .answer-padding')
            cy.log('Validadting: question: '+questionCounter);
            randomAnswerNumber = Math.floor(Math.random() * (max - min)) + min;
            cy.log('Tick checkbox');
            cy.get('.answerblock > .ng-star-inserted > .answer-padding > input').eq(randomAnswerNumber).check();

            cy.log('Validate: Button Validate')
            cy.get('.btn-group').contains('Validate').click();
            cy.wait(waitingTimeLong);

            cy.log('Validate: Next');
            cy.get('#nextButton').click();
            cy.wait(waitingTimeLong)
        }
        cy.log('Language DE -> EN')
        cy.get('select').select('en').should('have.value', 'en');
        cy.wait(waitingTimeLong);
    });



    // --- MC - Advanced ---
    it.skip('MC - Advanced', () => {
        var questionCounter = 1;
        var min = 0;
        var max = 2;
        var randomAnswerNumber = 0;

        // Clicking anker 'Introduction into Advanced'
        cy.wait(waitingTimeLong);
        // Button "BPMN for Advanced" --- click
        cy.contains('BPMN for Advanced').click();

        cy.log('Click Test your knowlege of the Advanced');
        cy.get('#cdk-accordion-child-8 > :nth-child(1) > :nth-child(2) > .row > .col > .ng-star-inserted').click();

        cy.log('Language: EN')
        cy.get('select').select('en').should('have.value', 'en');

        for(var i = 1; i < 8; i++){
            cy.log('RandomNR: ' +randomAnswerNumber);

            cy.log('Validate: Question: '+i);
            cy.get('.question-padding > div > p').should('not.be.empty');

            cy.get('.answerblock > .ng-star-inserted > .answer-padding')
            randomAnswerNumber = Math.floor(Math.random() * (max - min)) + min;
            cy.log('Tick checkbox');
            cy.get('.answerblock > .ng-star-inserted > .answer-padding > input').eq(randomAnswerNumber).check();

            cy.log('Validate: Button Validate')
            cy.get('.btn-group').contains('Validate').click();
            cy.wait(waitingTimeLong);
        

            cy.log('Validate: Next');
            cy.get('#nextButton').click();
            cy.wait(waitingTimeLong)
        }

        cy.log('Language: EN -> DE')
        cy.get('select').select('de').should('have.value', 'de');
        cy.wait(waitingTimeMiddle)

        for(var i = 1; i < 8; i++){
            randomAnswerNumber = Math.floor(Math.random * (max - min+1)) + min

            cy.log('Validate: Question: '+i);
            cy.get('.question-padding > div > p').should('not.be.empty');

            cy.get('.answerblock > .ng-star-inserted > .answer-padding')
            cy.log('Validadting: question: '+questionCounter);
            randomAnswerNumber = Math.floor(Math.random() * (max - min)) + min;
            cy.log('Tick checkbox');
            cy.get('.answerblock > .ng-star-inserted > .answer-padding > input').eq(randomAnswerNumber).check();

            cy.log('Validate: Button Validate')
            cy.get('.btn-group').contains('Validate').click();
            cy.wait(waitingTimeLong);

            cy.log('Validate: Next');
            cy.get('#nextButton').click();
            cy.wait(waitingTimeLong)
        }
        cy.log('Language DE -> EN')
        cy.get('select').select('en').should('have.value', 'en');
        cy.wait(waitingTimeLong);
    });





    // --- MC - Professional ---
    it.skip('MC - Advanced', () => {
        var questionCounter = 1;
        var min = 0;
        var max = 2;
        var randomAnswerNumber = 0;

        // Clicking anker 'Introduction into Professional'
        cy.wait(waitingTimeLong);
        // Button "BPMN for Professional" --- click
        cy.contains('BPMN for Professional').click();

        cy.log('Click Test your knowlege of the Professional');
        cy.get('#cdk-accordion-child-4 > :nth-child(1) > :nth-child(2) > .row > .col > .ng-star-inserted').click();

        cy.log('Language: EN')
        cy.get('select').select('en').should('have.value', 'en');

        for(var i = 1; i < 8; i++){
            cy.log('RandomNR: ' +randomAnswerNumber);

            cy.log('Validate: Question: '+i);
            cy.get('.question-padding > div > p').should('not.be.empty');

            cy.get('.answerblock > .ng-star-inserted > .answer-padding')
            randomAnswerNumber = Math.floor(Math.random() * (max - min)) + min;
            cy.log('Tick checkbox');
            cy.get('.answerblock > .ng-star-inserted > .answer-padding > input').eq(randomAnswerNumber).check();

            cy.log('Validate: Button Validate')
            cy.get('.btn-group').contains('Validate').click();
            cy.wait(waitingTimeLong);
        

            cy.log('Validate: Next');
            cy.get('#nextButton').click();
            cy.wait(waitingTimeLong)
        }

        cy.log('Language: EN -> DE')
        cy.get('select').select('de').should('have.value', 'de');
        cy.wait(waitingTimeMiddle)

        for(var i = 1; i < 8; i++){
            randomAnswerNumber = Math.floor(Math.random * (max - min+1)) + min

            cy.log('Validate: Question: '+i);
            cy.get('.question-padding > div > p').should('not.be.empty');

            cy.get('.answerblock > .ng-star-inserted > .answer-padding')
            cy.log('Validadting: question: '+questionCounter);
            randomAnswerNumber = Math.floor(Math.random() * (max - min)) + min;
            cy.log('Tick checkbox');
            cy.get('.answerblock > .ng-star-inserted > .answer-padding > input').eq(randomAnswerNumber).check();

            cy.log('Validate: Button Validate')
            cy.get('.btn-group').contains('Validate').click();
            cy.wait(waitingTimeLong);

            cy.log('Validate: Next');
            cy.get('#nextButton').click();
            cy.wait(waitingTimeLong)
        }
        cy.log('Language DE -> EN')
        cy.get('select').select('en').should('have.value', 'en');
        cy.wait(waitingTimeLong);
    });

});