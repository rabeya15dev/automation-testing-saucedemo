
# SauceDemo UI Automation — Q1, Q2, Q3

Playwright automation for https://www.saucedemo.com

---

## What Is In This Project

```
saucedemo-final/
│
├── pageObjects/                   ← one file per page
│   ├── basePage.js                ← parent class (common methods)
│   ├── loginPage.js               ← login page actions
│   ├── inventoryPage.js           ← products page actions
│   ├── cartPage.js                ← cart page actions
│   └── checkoutPage.js            ← checkout steps actions
│
├── tests/                         ← one file per question
│   ├── q1_lockedUser.spec.js      ← Q1 locked user tests
│   ├── q2_checkout.spec.js        ← Q2 full checkout flow
│   └── q3_performance.spec.js     ← Q3 performance user flow
│
├── playwright.config.js           ← Playwright settings
├── package.json                   ← npm scripts and dependencies
└── README.md                      ← this file
```

---

## What Each File Does

| File | What it does |
|------|-------------|
| `basePage.js` | Common methods used by all pages — clickButton, clickLink, fillInput |
| `loginPage.js` | Opens website, types username/password, clicks login, reads error |
| `inventoryPage.js` | Handles products page — reset state, add to cart, sort, logout |
| `cartPage.js` | Reads cart items, clicks checkout button |
| `checkoutPage.js` | Fills customer info, reads prices, clicks finish, reads success |
| `q1_lockedUser.spec.js` | Tests locked_out_user sees error message |
| `q2_checkout.spec.js` | Tests standard_user full checkout with 3 items |
| `q3_performance.spec.js` | Tests performance_glitch_user with sort Z-A checkout |
| `playwright.config.js` | Sets baseURL, timeout, reporters, browser |
| `package.json` | Defines npm run commands and dependencies |

---

## What Each Test Covers

### Q1 — Locked Out User
- Login with locked_out_user
- Verify red error message is visible
- Verify exact error text matches

### Q2 — Standard User Full Checkout 
- Login with standard_user
- Reset App State from hamburger menu
- Add 3 items: Backpack, Bike Light, Bolt T-Shirt
- Verify cart badge shows 3
- Go to cart — verify all 3 product names
- Proceed to checkout — fill Rabeya bosri 511711
- On overview page: verify product names
- On overview page: verify subtotal = sum of item prices
- On overview page: verify total = subtotal + tax
- Click Finish — verify "Thank you for your order!" message
- Verify confirmation page URL
- Reset App State again
- Logout

### Q3 — Performance Glitch User 
- Login with performance_glitch_user 
- Reset App State
- Sort products by Name Z to A
- Read the first product name after sorting
- Add that first product to cart
- Verify cart badge shows 1
- Go to cart — verify product name
- Proceed to checkout — fill info
- On overview page: verify product name
- Verify subtotal = item price
- Verify total = subtotal + tax
- Click Finish — verify success message
- Reset App State again
- Logout

---

## How Files Connect to Each Other

```
playwright.config.js
       ↓ Playwright reads this first
       ↓ gets baseURL = https://www.saucedemo.com
       ↓ gets timeout, reporter settings

tests/q1_lockedUser.spec.js
       ↓ imports
pageObjects/loginPage.js
       ↓ imports
pageObjects/basePage.js


tests/q2_checkout.spec.js
tests/q3_performance.spec.js
       ↓ import all 4 page objects
pageObjects/loginPage.js     → extends basePage.js
pageObjects/inventoryPage.js → extends basePage.js
pageObjects/cartPage.js      → extends basePage.js
pageObjects/checkoutPage.js  → extends basePage.js
       ↓ all extend
pageObjects/basePage.js
```

---

## Installation

```bash
npm install
npx playwright install
```

---

## Run Tests

```bash
# Run Q1 only
 q1: "npx playwright test tests/q1_lockedUser.spec.js    --headed",
    
# Run Q2 only
q2: "npx playwright test tests/q2_checkout.spec.js      --headed",
   
# Run Q3 only
q3: "npx playwright test tests/q3_performance.spec.js   --headed",

# Run all 3 together in sequence
npm run all
```

                              

## Generate Report

```bash
# Step 1: run tests 
npx playwright test --headed

# Step 2: generate and open report
npx playwright show-report html-report
```

Report opens automatically in your browser.


---

## Folders Created After Running Tests

```
html-report/       ← Playwright HTML report (created automatically)
test-results/      ← screenshots/videos of failed tests
```
