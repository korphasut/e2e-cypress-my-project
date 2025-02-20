let testUser;

describe("User Registration", () => {
  before(() => {
    cy.fixture("userForLogin").then((user) => {
      testUser = user;
    });
  });

  it("should login successfully if user exists", () => {
    cy.intercept("GET", "https://new-frontend-55s.pages.dev/").as("loginPage");
    cy.intercept("GET", "**/_nuxt/**").as("loadNuxt");
    cy.visit("https://new-frontend-55s.pages.dev/");
    cy.wait("@loginPage", { timeout: 5000 });
    cy.wait("@loadNuxt", { timeout: 5000 });
    cy.get('[data-testid="login-container"]').should("be.visible");

    cy.get('[data-testid="login-username"]').type(testUser.username);
    cy.get('[data-testid="login-password"]').type(testUser.password);
    cy.get('[data-testid="login-button"]').click();
  });
});
