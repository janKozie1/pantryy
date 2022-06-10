import { root } from "../../config";

describe('item', () => {
  it('allows user to create and delete an entry"', () => {
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

    cy.contains(randomName).click({force: true});

    cy.get('[data-test-id="delete-product"]').click();
  })

  it.only('allows user to edit an item', () => {
    const randomName = Math.random().toString(36);

    const newRandomName = Math.random().toString(36);
    const newRandomDescription = Math.random().toString();

    cy.visit(root);

    cy.contains('Log in').click();
    cy.get('input[name="email"]').type('test@cypress.com');

    cy.get('input[name="password"]').type('asdf');
    cy.get('button[type="submit"]').click();

    cy.contains('Add new').click();

    cy.get('input[name="name"]').type(randomName);
    cy.get('textarea[name="description"]').type("Test product description");
    cy.contains('Kilograms').click();
    cy.get('input[type="file"]').attachFile('test.png');

    cy.get('button[type="submit"]').click();

    cy.contains(randomName).click({force: true});

    cy.get('[data-test-id="edit-product"]').click();
    cy.contains('Edit product').should('exist');

    cy.get('input[name="name"]').focus().clear();
    cy.get('input[name="name"]').type(newRandomName);

    cy.get('textarea[name="description"]').focus().clear();
    cy.get('textarea[name="description"]').type(newRandomDescription);

    cy.contains(randomName).should('exist');
    cy.get('button[type="submit"]').click();
    cy.contains(randomName).should('not.exist');
    cy.contains(newRandomName).should('not.exist');

    cy.get('[data-test-id="delete-product"]').click();
  })
})
