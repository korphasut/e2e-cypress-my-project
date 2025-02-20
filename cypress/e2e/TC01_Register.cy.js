describe("Register", () => {
  let userTest;

  before(() => {
    cy.fixture("userForRegister")
      .then((user) => {
        userTest = user;

        cy.request({
          method: "DELETE",
          url: `https://fastapi-backend-d5cy.onrender.com/delete-user/${userTest.username}`,
          failOnStatusCode: false,
        });
      })
      .then((response) => {
        if (response.status === 200) {
          cy.log("✅ User deleted successfully.");
        } else if (response.status === 404) {
          cy.log("⚠️ User not found, skipping delete.");
        } else {
          throw new Error(`Unexpected status code: ${response.status}`);
        }
      });
  });

  it("Register Success", () => {
    cy.intercept("GET", "**").as("loadAll");
    cy.intercept("GET", "**/_nuxt/**").as("loadNuxt");
    cy.visit("https://new-frontend-55s.pages.dev/");
    cy.wait("@loadAll", { timeout: 5000 });
    cy.wait("@loadNuxt", { timeout: 5000 });
    cy.get('[data-testid="login-container"]').should("be.visible");
    cy.get('[data-testid="register-link"]').click();
    cy.get('[data-testid="register-title"]').should("be.visible");
    cy.get('[data-testid="register-username"]')
      .should("be.enabled")
      .type(`${userTest.username}`);
    cy.get('[data-testid="register-password"]').type(`${userTest.password}`);
    cy.get(`[data-testid="register-gender-${userTest.gender}"]`).click();
    cy.get('[data-testid="register-email"]').type(`${userTest.email}`);
    cy.get('[data-testid="register-mobile"]').type(`${userTest.mobile}`);
    cy.get('[data-testid="register-button"]').should("be.enabled").click();
    cy.get('[data-testid="login-container"]', { timeout: 60000 }).should(
      "be.visible"
    );
  });

  it("Register User Already Exists", () => {
    cy.intercept("GET", "https://new-frontend-55s.pages.dev/").as("loginPage");
    cy.intercept("GET", "**/_nuxt/**").as("loadNuxt");
    cy.visit("https://new-frontend-55s.pages.dev/");
    cy.wait("@loginPage", { timeout: 5000 });
    cy.wait("@loadNuxt", { timeout: 5000 });
    cy.get('[data-testid="login-container"]').should("be.visible");
    cy.get('[data-testid="register-link"]').click();
    cy.get('[data-testid="register-title"]').should("be.visible");
    cy.get('[data-testid="register-username"]').type(`${userTest.username}`);
    cy.get('[data-testid="register-password"]').type(`${userTest.password}`);
    cy.get(`[data-testid="register-gender-${userTest.gender}"]`).click();
    cy.get('[data-testid="register-email"]').type(`${userTest.email}`);
    cy.get('[data-testid="register-mobile"]').type(`${userTest.mobile}`);
    cy.get('[data-testid="register-button"]').should("be.enabled").click();

    // ใช้ should contain ปกติ
    cy.get('[data-testid="register-error"]', { timeout: 60000 }).should(
      "contain",
      "Username already exists"
    );

    /* // ใช้ invoke ถ้าข้อความไม่ตรงกัน 100%
    cy.get('[data-testid="register-error"]', { timeout: 60000 })
      .invoke("text")
      .should("include", "Username"); */

    /* // ใช้ should exist ก่อน เช็คว่า element มีอยู่จริง
    cy.get('[data-testid="register-error"]', { timeout: 60000 })
      .should("exist")
      .should("contain", "Username already exists"); */
  });
});
