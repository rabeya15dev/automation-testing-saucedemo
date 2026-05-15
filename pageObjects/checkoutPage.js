
import { BasePage } from './basePage.js';


export class CheckoutPage extends BasePage {

    constructor(page) {
        super(page);
        
        //  STEP 1 fill info page
        this.firstNameInput  = this.page.locator('[data-test="firstName"]');
        this.lastNameInput   = this.page.locator('[data-test="lastName"]');
        this.postalCodeInput = this.page.locator('[data-test="postalCode"]');
        this.continueBtn     = this.page.locator('[data-test="continue"]');

        // STEP 2 overview page
        this.overviewItemNames  = this.page.locator('.inventory_item_name');
        this.overviewItemPrices = this.page.locator('.inventory_item_price');
        this.summarySubtotal = this.page.locator('.summary_subtotal_label');
        this.summaryTax      = this.page.locator('.summary_tax_label');
        this.summaryTotal    = this.page.locator('.summary_total_label');
        this.finishBtn       = this.page.locator('[data-test="finish"]');


        // ── STEP 3 econfirmation page
        this.successHeader = this.page.locator('.complete-header');
        this.successText   = this.page.locator('.complete-text');
        this.successImg    = this.page.locator('.pony_express');
    }


    // wait for step 1 page to load
    async waitForStepOne() {
        await this.page.waitForURL('**/checkout-step-one.html');
    }
    


    // wait for confirmation page to load
    async waitForConfirmation() {
        await this.page.waitForURL('**/checkout-complete.html');
    }


    // fill first name, last name, postal code → click Continue
    async fillCustomerInfo(firstName, lastName, postalCode) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.page.waitForTimeout(2000);
        await this.continueBtn.click();
        await this.waitForStepTwo();
       
    }

// wait for step 1 page to load
async waitForStepOne() {
    await this.page.waitForURL('**/checkout-step-one.html');
}

// ADD THIS
async waitForStepTwo() {
    await this.page.waitForURL('**/checkout-step-two.html');
}

// wait for confirmation page to load
async waitForConfirmation() {
    await this.page.waitForURL('**/checkout-complete.html');
}


    // get all product names on overview page
    async getOverviewItemNames() {
        return this.overviewItemNames.allTextContents();

    }


    // get all product prices as numbers
    
    async getOverviewItemPrices() {
        const priceTexts = await this.overviewItemPrices.allTextContents(); 
        return priceTexts.map(p => parseFloat(p.replace('$', '')));
        // removes $ sign → converts to number
        // returns: [29.99, 9.99, 15.99]
        
    }


    // get the subtotal number  e.g. "Item total: $57.97" → 57.97
    async getSubtotal() {
        const text = await this.summarySubtotal.textContent();
        return parseFloat(text.replace(/[^0-9.]/g, ''));
        // removes all non-number characters → converts to number
    }


    // get the tax number
    async getTax() {
        const text = await this.summaryTax.textContent();
        return parseFloat(text.replace(/[^0-9.]/g, ''));
    }


    // get the total number
    async getTotal() {
        const text = await this.summaryTotal.textContent();
        return parseFloat(text.replace(/[^0-9.]/g, ''));
        
    }


    // click the FINISH button

    async clickFinish() {
        await this.finishBtn.click();
        await this.waitForConfirmation();
        // waits for confirmation page
    }


    // read the success heading text

    async getSuccessHeader() {
        return this.successHeader.textContent();
        // returns: "Thank you for your order!"
    }


    // read the success body text
    
    async getSuccessText() {
        return this.successText.textContent();
        // returns: "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
    await this.page.waitForTimeout(1000);
    }

}
