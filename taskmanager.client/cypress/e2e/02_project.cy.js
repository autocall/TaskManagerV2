describe("Proejcts", () => {
    beforeEach("Login", () => {
        cy.visit("/login");
        cy.get("input[name='Email']").type("test@tm.com");
        cy.get("input[name='Password']").type("123456");
        cy.get("button[type='submit']").click();
        cy.get("a.nav-link").should("contain.text", "test@tm.com");
        cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
    });

    it("Error", () => {
        let testContaner = {
            action: "getall",
            error: "Projects -> GetAll -> Error",
        };
        let testBase64 = btoa(JSON.stringify(testContaner));
        cy.visit(`/projects?test=${encodeURIComponent(testBase64)}`);
        cy.get("div.alert.alert-danger").should("have.text", testContaner.error);
    });

    it("Get", () => {
        cy.visit(`/projects`);
        cy.get("h1").should("have.text", "Projects");
    });

    describe("Project", () => {
        function addProjectIfNotExists() {
            cy.get("table.table").then(($table) => {
                if ($table.find("td:contains('Test Project')").length === 0) {
                    cy.log("Test Project not found, creating...");
                    cy.contains("button.btn-primary", "Add").click();
                    cy.get(".modal-dialog").should("be.visible").get(".modal-header").should("contain.text", "Add Project");
                    cy.get("input[name='Name']").type("Test Project");
                    cy.contains("button.btn-primary", "Save").click();
                    cy.get("table.table").contains("td", "Test Project").should("exist");
                }
            });
        }

        function editProject() {
            cy.get("table.table").contains("td", "Test Project").should("exist").parent().contains("a", "Edit").click();
            cy.get(".modal-dialog").should("be.visible").get(".modal-header").should("contain.text", "Edit Project");
            cy.get("input[name='Name']").clear().type("Test Project Updated");
            cy.contains("button.btn-primary", "Save").click();
            cy.get("table.table").contains("td", "Test Project Updated").should("exist");
        }

        function deleteProject() {
            cy.get("table.table").contains("td", "Test Project Updated").should("exist").parent().contains("a", "Delete").click();
            cy.get(".modal-dialog").should("be.visible").get(".modal-header").should("contain.text", "Delete Project");
            cy.contains(".modal-dialog button.btn-primary", "OK").click();
            cy.get("table.table").contains("td", "Test Project Updated").should("not.exist");
        }

        it("Add, Edit, Delete", () => {
            cy.visit("/projects");
            addProjectIfNotExists();
            editProject();
            deleteProject();
        });

        it("Add. Error", () => {
            let testContaner = {
                action: "create",
                error: "My Error",
            };
            let testBase64 = btoa(JSON.stringify(testContaner));
            cy.visit(`/projects?test=${encodeURIComponent(testBase64)}`);
            cy.contains("button.btn-primary", "Add").click();
            cy.get(".modal-dialog").should("be.visible").get(".modal-header").should("contain.text", "Add Project");
            cy.get("input[name='Name']").type("Test Project");
            cy.contains("button.btn-primary", "Save").click();
            cy.get("div.error").should("have.text", testContaner.error);
        });

        it("Add. Error in Field", () => {
            let testContaner = {
                action: "create",
                errors: { Name: "My Error in Field" },
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
});
