import { root } from "../../config";

describe('add item', () => {
  it('opens a drawer and validates the form"', () => {
    const randomName =  Math.random().toString(36);

    cy.visit(root);

    cy.contains('Log in').click();
    cy.get('input[name="email"]').type('test@cypress.com');

    cy.get('input[name="password"]').type('asdf');
    cy.get('button[type="submit"]').click();

    cy.contains('Add new product').should('not.exist');
    cy.contains('Add new').click();
    cy.contains('Add new product').should('exist');

    cy.get('button[type="submit"]').click();

    cy.contains('Must not be empty').should('exist');
    cy.contains('Must be a valid file').should('exist');
    cy.contains('One of the options must be selected').should('exist');

    cy.get('input[name="name"]').type(randomName);
    cy.get('textarea[name="description"]').type("Test product description");
    cy.contains('Kilograms').click();

    cy.get('button[type="submit"]').click();

    cy.contains('Must not be empty').should('not.exist');
    cy.contains('Must be a valid file').should('exist');
    cy.contains('One of the options must be selected').should('not.exist');

    cy.get('input[type="file"]').attachFile('test.png');
    cy.get('button[type="submit"]').click();

    cy.contains(randomName).click();

    cy.get('[data-test-id="delete-product"]').click();
  })
})
