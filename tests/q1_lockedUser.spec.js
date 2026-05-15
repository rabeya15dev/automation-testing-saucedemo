

import { test, expect } from '@playwright/test';
import { LoginPage }     from '../pageObjects/loginPage.js';



// ── test data 
const lockedUsername = 'locked_out_user';
const validUsername  = 'standard_user';
const password       = 'secret_sauce';
const expectedError  = 'Epic sadface: Sorry, this user has been locked out.';


// ── test group 
test.describe('Q1 - Locked Out User', () => {

    let loginPage;


    // runs before EVERY test automatically
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goToLoginPage('https://www.saucedemo.com');
    });


    // ── TEST 1 — main Q1 test 
    test('Verify error message appears for locked_out_user', async ({ page }) => {

        
        await loginPage.login(lockedUsername, password);
     
        //  error box must be visible
        await expect(loginPage.errorMessage).toBeVisible();
        

        // error text must match exactly 
        const errorText = await loginPage.getErrorMessage();
        expect(errorText.trim()).toBe(expectedError);
       

        //  user must NOT reach inventory page 
        expect(page.url()).not.toContain('inventory');
    });

});
