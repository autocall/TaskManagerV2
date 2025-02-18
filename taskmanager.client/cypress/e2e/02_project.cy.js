
describe("Proejcts", () => {
    beforeEach("Login", () => {
        cy.visit("/login");
        cy.get("input[name='Email']").type("test@tm.com");
        cy.get("input[name='Password']").type("123456");
        cy.get("button[type='submit']").click();
        cy.get("a.nav-link").should("contain.text", "test@tm.com");
        cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
    });

    it("Projects. Error", () => {
        let testContaner = {
            action: "getall",
            error: "Projects -> GetAll -> Error",
        };
        let testBase64 = btoa(JSON.stringify(testContaner));
        cy.visit(`/projects?test=${encodeURIComponent(testBase64)}`);
        cy.get("div.alert.alert-danger").should("have.text", testContaner.error);
    });

    it("Projects", () => {
        cy.visit(`/projects`);
        cy.get("h1").should("have.text", "Projects");
    });
});

describe("Project", () => {
    beforeEach("Login", () => {
        cy.visit("/login");
        cy.get("input[name='Email']").type("test@tm.com");
        cy.get("input[name='Password']").type("123456");
        cy.get("button[type='submit']").click();
        cy.get("a.nav-link").should("contain.text", "test@tm.com");
        cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
    });

    it("Projects -> Add Project. Error", () => {
        let testContaner = {
            action: "create",
            error: "Project -> Create -> Error",
        };
        let testBase64 = btoa(JSON.stringify(testContaner));
        cy.visit(`/projects?test=${encodeURIComponent(testBase64)}`);
        cy.contains("button.btn-primary", "Add").click();
        cy.get(".modal-dialog").should("be.visible");
        cy.get("input[name='Name']").type("Test Project");
        cy.contains("button.btn-primary", "Save").click();
        cy.get("div.error").should("have.text", testContaner.error);
    });

    it("Projects -> Add Project. Error in Field", () => {
        let testContaner = {
            action: "create",
            errors: { Name: "Project -> Create -> Name -> Error" },
        };
        let testBase64 = btoa(JSON.stringify(testContaner));
        cy.visit(`/projects?test=${encodeURIComponent(testBase64)}`);
        cy.contains("button.btn-primary", "Add").click();
        cy.get(".modal-dialog").should("be.visible");
        cy.get("input[name='Name']").type("Test Project");
        cy.contains("button.btn-primary", "Save").click();
        cy.get("input[name='Name']").next("div.error").should("have.text", testContaner.errors.Name);
    });
});
