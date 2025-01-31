import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'https://localhost:7090',
    chromeWebSecurity: false, // Disable security restrictions if needed
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      CYPRESS_INSECURE: true,
      CYPRESS_VERIFY_SSL: false,
    },
  },
});
