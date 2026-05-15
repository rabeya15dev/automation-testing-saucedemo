
import { BasePage } from './basePage.js';


export class CartPage extends BasePage {

    constructor(page) {
        super(page);

        this.cartItems     = this.page.locator('.cart_item');
        // all items in the cart

        this.cartItemNames = this.page.locator('.inventory_item_name');
        // the name text of each cart item

        this.checkoutBtn   = this.page.locator('[data-test="checkout"]');
        // the CHECKOUT button
    }


    // wait for cart page to load
    async waitForCartPage() {
        await this.page.waitForURL('**/cart.html');

        await this.page.waitForLoadState('domcontentloaded');
        
    }

    // get all product names in the cart as an array
    async getCartItemNames() {
        return this.cartItemNames.allTextContents();
        await this.page.waitForTimeout(2000);
    }


    // click the CHECKOUT button
    async clickCheckout() {
        await this.checkoutBtn.click();
        await this.page.waitForURL('**/checkout-step-one.html');
        await this.page.waitForTimeout(2000);
    }

}
