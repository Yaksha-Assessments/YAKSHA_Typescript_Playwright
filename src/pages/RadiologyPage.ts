import { Locator, Page } from "playwright";
import { CommonMethods } from "../tests/commonMethods";

export default class RadiologyPage {
    readonly page: Page;
    private radiologyModule: Locator;
    private listRequestSubModule: Locator;
    private fromDate: Locator;
    private okButton: Locator;
    private addReportButton: Locator;
    private closeModalButton: Locator;
    constructor(page: Page) {
        this.page = page;
        this.radiologyModule = page.locator('a[href="#/Radiology"]');
        this.listRequestSubModule = page.locator(
            '//a[contains(text(),"List Requests")]'
        );
        this.fromDate = page.locator(`(//input[@id="date"])[1]`);
        this.okButton = page.locator(`//button[contains(text(),"OK")]`);
        this.addReportButton = page.locator(
            '(//a[contains(text(),"Add Report")])[1]'
        );
        this.closeModalButton = page.locator(`a[title="Cancel"]`);
    }
    /**
   * @Test7.1 This method performs a radiology request and handles alerts that may arise during the process.
   * 
   * @param fromDate - The date string used to filter the radiology requests.
   * @description This method navigates through the Radiology module, applies a date filter,
   *              attempts to add a report, and handles any resulting alert dialogs.
   *              It loops through the process twice to ensure the requests are handled.
   * 
   * @return boolean - Returns true if the alert was successfully handled, false otherwise.
   */
    async performRadiologyRequestAndHandleAlert(
        fromDate: string
    ): Promise<boolean> {
        let isAlertHandled = false;
        try {
            for (let i = 0; i < 2; i++) {
                // Step 1: Navigate to Radiology Module and List Request sub-module
                await CommonMethods.highlightElement(this.radiologyModule);
                await this.radiologyModule.click();
                await CommonMethods.highlightElement(this.listRequestSubModule);
                await this.listRequestSubModule.click();
                // Step 2: Set From Date
                await CommonMethods.highlightElement(this.fromDate);
                await this.fromDate.type(fromDate, { delay: 100 });
                // Step 3: Click OK to apply date filter
                await CommonMethods.highlightElement(this.okButton);
                await this.okButton.click();
                // Wait for the table to load
                // await this.page.waitForTimeout(2000);
                await this.addReportButton.waitFor({ state: "visible" });
                // Step 4: Click "Add Report" button in the table
                await CommonMethods.highlightElement(this.addReportButton);
                await this.addReportButton.click();
                // Step 5: Close the modal
                // await this.page.waitForTimeout(2000);
                await CommonMethods.highlightElement(this.closeModalButton);
                await this.closeModalButton.click({ delay: 100, force: true });
                // Check if modal is still open; if so, press Enter on the Close button
                console.log(
                    `is close button visible ${await this.closeModalButton.isVisible()}`
                );
                if (await this.closeModalButton.isVisible()) {
                    await this.closeModalButton.click({ delay: 100, force: true });
                    await this.closeModalButton.press("Enter");
                }
                // Loop to press Shift+Tab three times
                for (let i = 0; i < 3; i++) {
                    await this.page.keyboard.press("Shift+Tab");
                }
                // Press Enter to confirm or close
                await this.page.keyboard.press("Enter");
                // Step 6: Handle alert
                isAlertHandled = await this.handleAlert();
            }
            return isAlertHandled;
        } catch (error) {
            console.error("Error during radiology request test:", error);
            return false;
        }
    }
    
    /**
   * @Test7.2 This method handles alert dialogs that may appear during radiology requests.
   * 
   * @description Listens for dialog events on the page. If the alert matches the expected
   *              message, it accepts the dialog; otherwise, it dismisses it. 
   * 
   * @return boolean - Returns true if the alert handling was successful.
   */
    async handleAlert(): Promise<boolean> {
        try {
            // Wait for the alert, then accept it
            this.page.on("dialog", async (dialog) => {
                console.log(`Alert message: ${dialog.message()}`);
                if (
                    dialog
                        .message()
                        .includes("Changes will be discarded. Do you want to close anyway?")
                ) {
                    await dialog.accept();
                    console.log("Alert accepted.");
                } else {
                    await dialog.dismiss();
                    console.log("Alert dismissed.");
                }
            });
            return true;
        } catch (error) {
            console.error("Failed to handle alert:", error);
            return false;
        }
    }
}
