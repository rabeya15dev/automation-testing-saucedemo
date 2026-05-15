

export class BasePage {

    constructor(page) {
        this.page = page;
    }


    // find any button by its visible text
    buttonLocator(button) {
        return this.page.getByRole('button', { name: button, exact: true });
    }


    // find any link by its visible text
    linkLocator(link) {
        return this.page.getByRole('link', { name: link });
    }


    // click any button by its visible text
    async clickButton(button) {
        await this.buttonLocator(button).click();
    }


    // click any link by its visible text
    async clickOnLink(link) {
        await this.linkLocator(link).click();
    }


    // type into any input by its label
    async fillInput(name, value) {
        await this.page.getByRole('textbox', { name: name }).fill(value);
    }

}
