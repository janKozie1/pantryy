import { root } from "../../config";

describe('register', () => {
  it('initializes form and validates it correctly"', () => {
    cy.visit(root);

    cy.contains('Create an account').should('have.attr', 'href');
    cy.contains('Create an account').click();

    cy.get('input[name="email"]').should('have.value', '');
    cy.get('input[name="password"]').should('have.value', '');
    cy.get('input[name="repeated_password"]').should('have.value', '');

    cy.get('input[name="email"]').type('asdf');
    cy.get('button[type="submit"]').click();

    cy.contains('Must be a valid email').should('exist');
    cy.contains('Must not be empty').should('exist');

    cy.get('input[name="email"]').focus().clear();
    cy.get('input[name="email"]').type('test@cypress.com');

    cy.get('button[type="submit"]').click();
    cy.contains('Must be a valid email').should('not.exist');

    cy.get('input[name="password"]').type('asdf');
    cy.get('input[name="repeated_password"]').type('asdf1');

    cy.get('button[type="submit"]').click();
    cy.contains('Passwords must match').should('exist');

    cy.get('input[name="repeated_password"]').type('{backspace}');
    cy.get('button[type="submit"]').click();

    cy.contains('Email is already taken').should('exist');
  })

  it('log ins automatically after registering', () => {
    cy.visit(root);

    const randomEmail = `${Math.random().toString(36).substring(2)}@gmail.com`;
    const randomPassword = Math.random().toString(36);

    cy.contains('Create an account').should('have.attr', 'href');
    cy.contains('Create an account').click();

    cy.get('input[name="email"]').type(randomEmail);
    cy.get('input[name="password"]').type(randomPassword);
    cy.get('input[name="repeated_password"]').type(randomPassword);

    cy.get('button[type="submit"]').click();
    cy.get('input[name="search"]').should('exist');

    cy.contains('Log out').click();
    cy.get('input[name="search"]').should('not.exist');
    cy.contains('Log in').should('exist');

    cy.get('input[name="email"]').type(randomEmail);
    cy.get('input[name="password"]').type(randomPassword);
    cy.get('button[type="submit"]').click();
    cy.get('input[name="search"]').should('exist');
    cy.contains('Log out').click();
  })
})
