import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  // where to look for test files
  testDir: './tests',

  // run one test at a time — never parallel
  workers:       1,
  fullyParallel: false,

  // max time for one full test
  timeout: 100000,

  // generate allure report + html report after every run
  reporter: [
     ['list'],
    ['html', { outputFolder: 'html-report', open: 'never' }],
    ['allure-playwright']
  ],


  use: {
    // base website — all page.goto('/') calls use this
    baseURL: 'https://www.saucedemo.com',

    // false = you can SEE the browser while tests run
    headless: false,

    // save screenshot/video/trace only when test FAILS
    screenshot: 'only-on-failure',
    video:      'retain-on-failure',
    trace:      'retain-on-failure',

    // wait max 10 seconds for any element to appear
    actionTimeout:     10000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ]

    


});

