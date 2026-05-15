

import { test, expect }  from '@playwright/test';
import { LoginPage }      from '../pageObjects/loginPage.js';
import { InventoryPage }  from '../pageObjects/inventoryPage.js';
import { CartPage }       from '../pageObjects/cartPage.js';
import { CheckoutPage }   from '../pageObjects/checkoutPage.js';



// ── test data 
const username   = 'standard_user';
const password   = 'secret_sauce';

const firstName  = 'Rabeya';
const lastName   = 'Bosri';
const postalCode = '511711';

const product1   = 'Sauce Labs Backpack';
const product2   = 'Sauce Labs Bike Light';
const product3   = 'Sauce Labs Bolt T-Shirt';

const successHeader = 'Thank you for your order!';
const successMsg    = 'Your order has been dispatched, and will arrive just as fast as the pony can get there!';


// ── test group 
test.describe('Q2 - Standard User Full Checkout', () => {

    let loginPage;
    let inventoryPage;
    let cartPage;
    let checkoutPage;


    // runs before EVERY test — login and reset state
    test.beforeEach(async ({ page }) => {
        loginPage    = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage     = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        await loginPage.goToLoginPage('https://www.saucedemo.com');
        await loginPage.login(username, password);
        await inventoryPage.waitForInventoryPage();
        await inventoryPage.resetAppState();

    });


    // runs after EVERY test — clean up
    test.afterEach(async () => {
        try {
            await inventoryPage.resetAppState();
            await inventoryPage.logout();
        } catch {
            // if test already logged out → ignore the error
        }
    });


    //  MAIN TEST 
    test('Add 3 items, verify prices, finish order, verify success', async ({ page }) => {


        //  STEP 1: add 3 products to cart 
        await inventoryPage.addToCartByName(product1);
        await inventoryPage.addToCartByName(product2);
        await inventoryPage.addToCartByName(product3);

        const cartCount = await inventoryPage.getCartCount();
        expect(cartCount).toBe(3);

        //  STEP 2: go to cart 
        await inventoryPage.goToCart();
        await cartPage.waitForCartPage();
        const cartNames = await cartPage.getCartItemNames();
        expect(cartNames).toContain(product1);
        expect(cartNames).toContain(product2);
        expect(cartNames).toContain(product3);


        // STEP 3: click checkout 
        await cartPage.clickCheckout();
        await checkoutPage.waitForStepOne();
        // STEP 4: fill customer info 
        await checkoutPage.fillCustomerInfo(firstName, lastName, postalCode);
        await checkoutPage.waitForStepTwo();


        //STEP 5: verify product names on overview 
        const overviewNames = await checkoutPage.getOverviewItemNames();
        expect(overviewNames).toContain(product1);
        expect(overviewNames).toContain(product2);
        expect(overviewNames).toContain(product3);


        // STEP 6: verify total price calculation 
        const prices   = await checkoutPage.getOverviewItemPrices();

        const subtotal = await checkoutPage.getSubtotal();

        const tax      = await checkoutPage.getTax();

        const total    = await checkoutPage.getTotal();

        const sumOfPrices = prices.reduce((sum, p) => sum + p, 0);

        expect(subtotal).toBeCloseTo(sumOfPrices, 2);
        expect(total).toBeCloseTo(subtotal + tax, 2);


        //STEP 7: finish the order 
        await checkoutPage.clickFinish();
        

        // STEP 8: verify success message 
        const header = await checkoutPage.getSuccessHeader();
       
        const text = await checkoutPage.getSuccessText();

        expect(header.trim()).toBe(successHeader);
        expect(text.trim()).toBe(successMsg);
        await expect(checkoutPage.successImg).toBeVisible();
        await expect(page).toHaveURL(/checkout-complete\.html/);

    });

});
