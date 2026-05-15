

import { test, expect }  from '@playwright/test';
import { LoginPage }      from '../pageObjects/loginPage.js';
import { InventoryPage }  from '../pageObjects/inventoryPage.js';
import { CartPage }       from '../pageObjects/cartPage.js';
import { CheckoutPage }   from '../pageObjects/checkoutPage.js';


// test data 
const username   = 'performance_glitch_user';
const password   = 'secret_sauce';

const firstName  = 'Rabeya';
const lastName   = 'Bosri';
const postalCode = '511711';

const successHeader = 'Thank you for your order!';
const successMsg    = 'Your order has been dispatched, and will arrive just as fast as the pony can get there!';


// test group 
test.describe('Q3 - Performance Glitch User', () => {

    test.setTimeout(100000);

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
            
        }
    });


    // MAIN TEST 
    test('Sort Z to A, add first product, verify price, finish order', async ({ page }) => {


        // STEP 1: sort products Z to A 
        await inventoryPage.sortProducts('za');

        // STEP 2: read the first product name after sorting 
        const firstProductName = await inventoryPage.getFirstProductName();
        expect(firstProductName).toBeTruthy();



        //STEP 3: add that first product to cart 
        const allNames = await inventoryPage.getAllProductNames();
        await inventoryPage.addToCartByName(allNames[0]);

        // cart badge must show 1
        const cartCount = await inventoryPage.getCartCount();
        expect(cartCount).toBe(1);


        // STEP 4: go to cart 
        await inventoryPage.goToCart();
      

        await cartPage.waitForCartPage();
        const cartNames = await cartPage.getCartItemNames();
        expect(cartNames).toContain(firstProductName.trim());
        
        // STEP 5: click checkout 
        await cartPage.clickCheckout();
        await checkoutPage.waitForStepOne();

        // STEP 6: fill customer info 
        await checkoutPage.fillCustomerInfo(firstName, lastName, postalCode);
        await checkoutPage.waitForStepTwo();


        // STEP 7: verify product name on overview 
        const overviewNames = await checkoutPage.getOverviewItemNames();
        expect(overviewNames).toContain(firstProductName.trim());
        // the product we added must appear on overview


        // STEP 8: verify total price calculation 
        const prices   = await checkoutPage.getOverviewItemPrices();
        const subtotal = await checkoutPage.getSubtotal();
        const tax      = await checkoutPage.getTax();
        const total    = await checkoutPage.getTotal();

        const sumOfPrices = prices.reduce((sum, p) => sum + p, 0);
        expect(subtotal).toBeCloseTo(sumOfPrices, 2);
        expect(total).toBeCloseTo(subtotal + tax, 2);

        // STEP 9: finish the order 
        await checkoutPage.clickFinish();

        // STEP 10: verify success message 
        const header = await checkoutPage.getSuccessHeader();
        const text   = await checkoutPage.getSuccessText();

        expect(header.trim()).toBe(successHeader);
        expect(text.trim()).toBe(successMsg);

        await expect(checkoutPage.successImg).toBeVisible();
        await expect(page).toHaveURL(/checkout-complete\.html/);

    });

});
