import { Page } from "playwright-core";


export default class LandingPage {

    private page: Page

    constructor(page: Page) {
        this.page = page;
    }

    /********************************************************** Elements ********************************************************* */
    get pageHeading() { return this.page.getByRole('heading').first() }
    get viewAllFeatureButton() { return this.page.getByRole('link', { name: 'View all features' }) }
    linkText(link: string) { return this.page.getByRole('link', { name: `${link}` }) }

    /********************************************************** Actions ********************************************************* */

    async pageHeadingText() {
        return await this.pageHeading.innerText()
    }

    async clickOnFeaturesBUtton() {
        await this.viewAllFeatureButton.waitFor()
        await this.viewAllFeatureButton.click()
    }

}
