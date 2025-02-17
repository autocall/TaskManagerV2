describe("Account SignUp Error", () => {
    it("SignUp", () => {
      let error = "Account -> SignUp -> Error";
        cy.visit(`/signup?error=${encodeURIComponent(error)}`);
        cy.get("input[name='username']").type("test");
        cy.get("input[name='email']").type("test@tm.com");
        cy.get("input[name='password']").type("123456");
        cy.get("input[name='confirmPassword']").type("123456");
        cy.get("button[type='submit']").click();
        cy.url().should("include", `${Cypress.config("baseUrl")}/signup`);
        cy.get("div.error").should("have.text", error);
    });
});

describe("Account Login Error", () => {
  it("Login", () => {
    let error = "Account -> Login -> Error";
      cy.visit(`/login?error=${encodeURIComponent(error)}`);
      cy.get("input[name='email']").type("test@tm.com");
      cy.get("input[name='password']").type("123456");
      cy.get("button[type='submit']").click();
      cy.url().should("include", `${Cypress.config("baseUrl")}/login`);
      cy.get("div.error").should("have.text", error);
  });
});

describe("Account", () => {
    it("SignUp", () => {
        cy.visit("/signup");
        cy.get("input[name='username']").type("test");
        cy.get("input[name='email']").type("test@tm.com");
        cy.get("input[name='password']").type("123456");
        cy.get("input[name='confirmPassword']").type("123456");
        cy.get("button[type='submit']").click();
        cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
        // expect <a class="nav-link" href="/profile" data-discover="true">anton@tm.com (User)</a>
        cy.get("a.nav-link").should("contain.text", "test@tm.com");

        cy.get("a#logout").click();
    });

    it("Login", () => {
        cy.visit("/login");
        cy.get("input[name='email']").type("test@tm.com");
        cy.get("input[name='password']").type("123456");
        cy.get("button[type='submit']").click();
        cy.get("a.nav-link").should("contain.text", "test@tm.com");
        cy.url().should("eq", `${Cypress.config("baseUrl")}/`);

        cy.get("a#logout").click();
        cy.url().should("include", "/login");
    });
});
