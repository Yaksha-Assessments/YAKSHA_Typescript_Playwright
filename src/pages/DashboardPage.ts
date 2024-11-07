import { Locator, Page } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    private dashboardLogo: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dashboardLogo = page.locator(`img[title="Go to DanpheEMR-Home"]`);
    }

    async isDashboardVisible(): Promise<boolean> {
        await this.dashboardLogo.waitFor({ state: 'visible' });
        return this.dashboardLogo.isVisible();
    }
}
