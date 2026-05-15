

import { BasePage } from './basePage.js';


export class InventoryPage extends BasePage {

    constructor(page) {
        super(page);
       
        // ── hamburger menu elements 
        this.hamburgerMenuBtn = this.page.locator('#react-burger-menu-btn');
        this.resetStateLink   = this.page.locator('#reset_sidebar_link');
        this.logoutLink       = this.page.locator('#logout_sidebar_link');
        this.menuCloseBtn     = this.page.locator('#react-burger-cross-btn');
        
        // ── cart elements
        this.cartIcon  = this.page.locator('.shopping_cart_link');
        this.cartBadge = this.page.locator('.shopping_cart_badge');
        // ── product page elements 
        this.sortDropdown   = this.page.locator('[data-test="product-sort-container"]');
        this.allProductNames = this.page.locator('.inventory_item_name');
      
    }


     async waitForInventoryPage() {
        await this.page.waitForURL('**/inventory.html');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
    }


   
    async openMenu() {
        await this.hamburgerMenuBtn.click();
        await this.resetStateLink.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(2000);
    }


    // click Reset App State from menu → clears the cart

    async resetAppState() {
        await this.openMenu();
        await this.resetStateLink.click();
        await this.menuCloseBtn.click();
        await this.menuCloseBtn.waitFor({ state: 'hidden' });
        await this.page.waitForTimeout(2000);
    }


    // logout from the menu
    async logout() {
        await this.openMenu();
        await this.logoutLink.click();
        await this.page.waitForURL('**/');
        await this.page.waitForTimeout(2000);
      
    }


    // add one product to cart by its exact name
    
    async addToCartByName(productName) {
        const item = this.page
            .locator('.inventory_item')
            .filter({ hasText: productName });
        const addButton = item.locator('button');
        await addButton.click();
        await this.page.waitForTimeout(2000);
    }


    // sort products using the dropdown
   
    async sortProducts(sortValue) {
        await this.sortDropdown.selectOption(sortValue);
        await this.page.waitForTimeout(1000);
    }


    // read how many items are in the cart
   
    async getCartCount() {
        const badge = this.cartBadge;
        if (await badge.isVisible()) {
            return parseInt(await badge.textContent(), 10);
        }

        return 0;
        
    }


    // click the cart icon to go to cart page
  
    async goToCart() {
        await this.cartIcon.click();
        await this.page.waitForURL('**/cart.html');
        await this.page.waitForTimeout(2000);
        
    }


    // get the name of the FIRST product shown on screen
    
    async getFirstProductName() {
        await this.page.waitForTimeout(2000);
        return this.allProductNames.first().textContent();
    }


    // get ALL product names on screen as an array
    async getAllProductNames() {
        await this.page.waitForTimeout(2000);
        return this.allProductNames.allTextContents();
    }

}
