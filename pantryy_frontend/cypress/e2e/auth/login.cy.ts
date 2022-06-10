import { root } from "../../config";

describe('log in', () => {
  it('initializes form and validates it correctly"', () => {
    cy.visit(root);

    cy.contains('Log in').should('have.attr', 'href');
    cy.contains('Log in').click();

    cy.get('input[name="email"]').should('have.value', '');
    cy.get('input[name="password"]').should('have.value', '');

    cy.get('input[name="email"]').type('asdf');
    cy.get('button[type="submit"]').click();

    cy.contains('Must be a valid email').should('exist');
    cy.contains('Must not be empty').should('exist');

    cy.get('input[name="email"]').focus().clear();
    cy.get('input[name="email"]').type('test@cypress.com');

    cy.get('input[name="password"]').type('asdf');
    cy.get('button[type="submit"]').click();

    cy.contains('Log out').should('exist');
    cy.contains('Log out').click();
  })
})
