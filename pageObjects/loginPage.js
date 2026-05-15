

import { BasePage } from './basePage.js';

export class LoginPage extends BasePage {

    constructor(page) {
        super(page);

        // elements on the login page 
        this.usernameInput = this.page.locator('[data-test="username"]');
        this.passwordInput = this.page.locator('[data-test="password"]');
        this.loginButton   = this.page.locator('[data-test="login-button"]');
        this.errorMessage  = this.page.locator('[data-test="error"]');
    }


    // open the SauceDemo website
    async goToLoginPage(url = '/') {
        await this.page.goto(url);
        await this.usernameInput.waitFor({ state: 'visible' });
    }


    // type username into the username box
    async enterUsername(username = '') {
        await this.usernameInput.fill(username);
    }

    // type password into the password box
    async enterPassword(password = '') {
        await this.passwordInput.fill(password);
    }


    // click the LOGIN button
    async clickLoginButton() {
        await this.loginButton.click();
        await this.page.waitForTimeout(5000);
    }


    // do the login: type username + password + click login
    async login(username, password) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
        await this.page.waitForTimeout(2000);
    }


    // read the error message text from the red error box
    async getErrorMessage() {
        await this.errorMessage.waitFor({ state: 'visible' });
        return this.errorMessage.textContent();
        await this.page.waitForTimeout(5000);
    }

}
