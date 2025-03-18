describe("Overview", () => {
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
            action: "get",
            error: "Overview -> Get -> Error",
        };
        let testBase64 = btoa(JSON.stringify(testContaner));
        cy.visit(`/?test=${encodeURIComponent(testBase64)}`);
        cy.get("div.alert.alert-danger").should("have.text", testContaner.error);
    });

    it("Get", () => {
        cy.visit(`/`);
        cy.get(".main-section").should("exist");
    });

    describe("Task", () => {
        function addTaskIfNotExists() {
            cy.get(".main-section").then(($main) => {
                if ($main.find("div.card-body > div > span.task-title:contains('Test Task')").length === 0) {
                    cy.log("Test Task not found, creating...");
                    cy.contains("button.btn-primary", "Task").click();
                    cy.get(".modal-dialog").should("be.visible").get(".modal-header").should("contain.text", "Add Task");
                    cy.get("input[name='Title']").type("Test Task");
                    cy.contains("button.btn-primary", "Save").click();
                    cy.get(".main-section .column-card > .card-body").contains("span.task-title", "Test Task").should("exist");
                }
            });
        }

        function editTask() {
            cy.get(".main-section .column-card > .card-body")
                .contains("span.task-title", "Test Task")
                .should("exist")
                .parents(".card-body")
                .contains("a", "Edit")
                .click();
            cy.get(".modal-dialog").should("be.visible").get(".modal-header").should("contain.text", "Edit Task");
            cy.get("input[name='Title']").clear().type("Test Task Updated");
            cy.contains("button.btn-primary", "Save").click();
            cy.get(".main-section .column-card > .card-body > div").contains("span", "Test Task Updated").should("exist");
        }

        function deleteTask() {
            cy.get(".main-section .column-card > .card-body")
                .contains("span.task-title", "Test Task Updated")
                .should("exist")
                .parents(".card-body")
                .contains("a", "Delete")
                .click();
            cy.get(".modal-dialog").should("be.visible").get(".modal-header").should("contain.text", "Delete Task");
            cy.contains(".modal-dialog button.btn-primary", "OK").click();
            cy.get(".main-section").contains("span.task-title", "Test Task Updated").should("not.exist");
        }

        it("Add, Edit, Delete", () => {
            cy.visit("/");
            addTaskIfNotExists();
            editTask();
            deleteTask();
        });

        it("Add. Error", () => {
            let testContaner = {
                action: "create",
                error: "My Error",
            };
            let testBase64 = btoa(JSON.stringify(testContaner));
            cy.visit(`/?test=${encodeURIComponent(testBase64)}`);
            cy.contains("button.btn-primary", "Task").click();
            cy.get(".modal-dialog").should("be.visible").get(".modal-header").should("contain.text", "Add Task");
            cy.get("input[name='Title']").type("Test Task");
            cy.contains("button.btn-primary", "Save").click();
            cy.get("div.error").should("have.text", testContaner.error);
        });

        it("Add. Error in Field", () => {
            let testContaner = {
                action: "create",
                errors: { Title: "My Error in Field" },
            };
            let testBase64 = btoa(JSON.stringify(testContaner));
            cy.visit(`/?test=${encodeURIComponent(testBase64)}`);
            cy.contains("button.btn-primary", "Task").click();
            cy.get(".modal-dialog").should("be.visible");
            cy.get("input[name='Title']").type("Test Task");
            cy.contains("button.btn-primary", "Save").click();
            cy.get("input[name='Title']").closest('.form-group').get("div.error").should("have.text", testContaner.errors.Title);
        });
    });
});
