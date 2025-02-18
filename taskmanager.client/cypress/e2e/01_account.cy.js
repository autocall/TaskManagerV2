describe("Account -> SignUp. Error", () => {
    it("SignUp", () => {
        let testContaner = {
            action: "signup",
            error: "Account -> SignUp -> Error",
        };
        let testBase64 = btoa(JSON.stringify(testContaner));
        cy.visit(`/signup?test=${encodeURIComponent(testBase64)}`);
        cy.get("input[name='UserName']").type("test");
        cy.get("input[name='Email']").type("test@tm.com");
        cy.get("input[name='Password']").type("123456");
        cy.get("input[name='ConfirmPassword']").type("123456");
        cy.get("button[type='submit']").click();
        cy.url().should("include", `${Cypress.config("baseUrl")}/signup`);
        cy.get("div.error").should("have.text", testContaner.error);
    });
});

describe("Account -> SignUp. Error in Field", () => {
    it("SignUp", () => {
        let testContaner = {
            action: "signup",
            errors: { UserName: "Account -> SignUp -> UserName -> Error" },
        };
        let testBase64 = btoa(JSON.stringify(testContaner));
        cy.visit(`/signup?test=${encodeURIComponent(testBase64)}`);
        cy.get("input[name='UserName']").type("test");
        cy.get("input[name='Email']").type("test@tm.com");
        cy.get("input[name='Password']").type("123456");
        cy.get("input[name='ConfirmPassword']").type("123456");
        cy.get("button[type='submit']").click();
        cy.url().should("include", `${Cypress.config("baseUrl")}/signup`);
        cy.get("input[name='UserName']").next("div.error").should("have.text", testContaner.errors.UserName);
    });
});

describe("Account -> Login. Error", () => {
    it("Login", () => {
        let testContaner = {
            action: "signin",
            error: "Account -> Login -> Error",
        };
        let testBase64 = btoa(JSON.stringify(testContaner));
        cy.visit(`/login?test=${encodeURIComponent(testBase64)}`);
        cy.get("input[name='Email']").type("test@tm.com");
        cy.get("input[name='Password']").type("123456");
        cy.get("button[type='submit']").click();
        cy.url().should("include", `${Cypress.config("baseUrl")}/login`);
        cy.get("div.error").should("have.text", testContaner.error);
    });
});

describe("Account -> Login. Error in Field", () => {
    it("Login", () => {
        let testContaner = {
            action: "signin",
            errors: { Email: "Account -> Login -> Email -> Error" },
        };
        let testBase64 = btoa(JSON.stringify(testContaner));
        cy.visit(`/login?test=${encodeURIComponent(testBase64)}`);
        cy.get("input[name='Email']").type("test@tm.com");
        cy.get("input[name='Password']").type("123456");
        cy.get("button[type='submit']").click();
        cy.url().should("include", `${Cypress.config("baseUrl")}/login`);
        cy.get("input[name='Email']").next("div.error").should("have.text", testContaner.errors.Email);
    });
});

describe("Account", () => {
    it("SignUp", () => {
        cy.visit("/signup");
        cy.get("input[name='UserName']").type("test");
        cy.get("input[name='Email']").type("test@tm.com");
        cy.get("input[name='Password']").type("123456");
        cy.get("input[name='ConfirmPassword']").type("123456");
        cy.get("button[type='submit']").click();
        cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
        // expect <a class="nav-link" href="/profile" data-discover="true">anton@tm.com (User)</a>
        cy.get("a.nav-link").should("contain.text", "test@tm.com");

        cy.get("a#logout").click();
    });

    it("Login", () => {
        cy.visit("/login");
        cy.get("input[name='Email']").type("test@tm.com");
        cy.get("input[name='Password']").type("123456");
        cy.get("button[type='submit']").click();
        cy.get("a.nav-link").should("contain.text", "test@tm.com");
        cy.url().should("eq", `${Cypress.config("baseUrl")}/`);

        cy.get("a#logout").click();
        cy.url().should("include", "/login");
    });
});
