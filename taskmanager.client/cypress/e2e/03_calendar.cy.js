const testCases = [
    { name: "Current Month", path: "/", action: "getcurrent", error: "Calendar -> GetCurrent -> Error" },
    { name: "Year Calendar", path: "/calendar", action: "getyear", error: "Calendar -> GetYear -> Error" },
];

Cypress._.each(testCases, (testData) => {
    describe(testData.name, () => {
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
                action: testData.action,
                error: testData.error,
            };
            let testBase64 = btoa(JSON.stringify(testContaner));
            cy.visit(`${testData.path}?test=${encodeURIComponent(testBase64)}`);
            cy.get("div.alert.alert-danger").should("have.text", testContaner.error);
        });

        it("Get", () => {
            cy.visit(testData.path);
            cy.get(".cal-month-name").should("exist");
            cy.get(".card > .card-body > .cal-days > .btn.today:not(.secondary)").should("exist");
        });

        describe("Event", () => {
            // to click on the today if the popover is not visible and return the popover
            function tryToShowContextMenu() {
                let popoverPath = "#popover-basic > .popover-body > .list-group";
                cy.get("body").then(($body) => {
                    if ($body.find(popoverPath).length > 0) {
                        cy.get(popoverPath);
                    } else {
                        cy.get(".card > .card-body > .cal-days > .btn.today:not(.secondary)").click();
                    }
                });
                return cy.get(popoverPath);
            }

            function addEventIfNotExists() {
                let list = tryToShowContextMenu();
                list.then(($listGroup) => {
                    // if the event is not found, create it
                    if ($listGroup.find("button:contains('Test Event')").length === 0) {
                        cy.log("Test Event not found, creating...");
                        list.get(".list-group-item").should("contain.text", "Add Event").click();
                        cy.get(".modal-dialog").should("be.visible").get(".modal-header").should("contain.text", "Add Event");
                        cy.get("input[name='Name']").type("Test Event");
                        cy.contains("button.btn-primary", "Save").click();
                        cy.get(".modal-dialog").should("not.exist");
                    }
                    // check if the event is created
                    tryToShowContextMenu().get(".list-group-item").contains("button", "Test Event").should("exist");
                });
            }

            function editEvent() {
                // to open the context menu and click on the the event
                tryToShowContextMenu().contains(".list-group-item", "Test Event").should("exist").click();
                // checks the edit dialog
                cy.get(".modal-dialog").should("be.visible").get(".modal-header").should("contain.text", "Edit Event");
                // edits the event
                cy.get("input[name='Name']").clear().type("Test Event Updated");
                // clicks on the save button
                cy.contains("button.btn-primary", "Save").click();
                tryToShowContextMenu().contains(".list-group-item", "Test Event Updated").should("exist");
            }

            function deleteEvent() {
                // to open the context menu and click on the the event
                tryToShowContextMenu().contains(".list-group-item", "Test Event").should("exist").click();
                // to open the edit dialog
                cy.get(".modal-dialog").should("be.visible").get(".modal-footer").contains("button", "Delete").click();
                // to confirm the delete
                cy.get(".modal-dialog").should("be.visible").get(".modal-header").should("contain.text", "Delete Event");
                // clicks on the save button
                cy.contains(".modal-dialog button.btn-primary", "OK").click();
                // checks to disappear the dialog
                cy.get(".modal-dialog").should("not.exist");
            }

            it("Add, Edit, Delete", () => {
                cy.visit(testData.path);
                addEventIfNotExists();
                editEvent();
                deleteEvent();
            });

            it("Add. Error", () => {
                let testContaner = {
                    action: "create",
                    error: "My Error",
                };
                let testBase64 = btoa(JSON.stringify(testContaner));
                cy.visit(`${testData.path}?test=${encodeURIComponent(testBase64)}`);
                // looks like the addEventIfNotExists
                tryToShowContextMenu().get(".list-group-item").should("contain.text", "Add Event").click();
                cy.get(".modal-dialog").should("be.visible").get(".modal-header").should("contain.text", "Add Event");
                cy.get("input[name='Name']").type("Test Event");
                cy.contains("button.btn-primary", "Save").click();
                cy.get("div.error").should("have.text", testContaner.error);
            });

            it("Add. Error in Field", () => {
                let testContaner = {
                    action: "create",
                    errors: { Name: "My Error in Field" },
                };
                let testBase64 = btoa(JSON.stringify(testContaner));
                cy.visit(`${testData.path}?test=${encodeURIComponent(testBase64)}`);
                // looks like the addEventIfNotExists
                tryToShowContextMenu().get(".list-group-item").should("contain.text", "Add Event").click();
                cy.get(".modal-dialog").should("be.visible").get(".modal-header").should("contain.text", "Add Event");
                cy.get("input[name='Name']").type("Test Event");
                cy.contains("button.btn-primary", "Save").click();
                cy.get("input[name='Name']").closest('.form-group').get("div.error").should("have.text", testContaner.errors.Name);
            });
        });
    });
});
