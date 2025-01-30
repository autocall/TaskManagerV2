describe("Sign Up", () => {
    beforeEach(() => {
      cy.visit("/login");
    });
  
    it("Should successfully login with valid credentials", () => {
      cy.get("input[name='email']").type("test@tm.com");
      cy.get("input[name='password']").type("123456");
      cy.get("button[type='submit']").click();
      cy.url().should("include", "/");
      
      cy.get("a#logout").click();
      cy.url().should("include", "/login");
    });
  });