describe("Sign Up", () => {
    beforeEach(() => {
      cy.visit("/signup");
    });
  
    it("Should successfully register with valid credentials", () => {
      cy.get("input[name='username']").type("test");
      cy.get("input[name='email']").type("test@tm.com");
      cy.get("input[name='password']").type("123456");
      cy.get("input[name='confirmPassword']").type("123456");
      cy.get("button[type='submit']").click();
      cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
      // expect <a class="nav-link" href="/profile" data-discover="true">anton@tm.com (User)</a>
      cy.get("a.nav-link").should("contain.text", "test@tm.com");
    });
  });