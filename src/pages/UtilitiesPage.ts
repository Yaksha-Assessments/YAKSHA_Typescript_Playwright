import { Page, expect, Locator } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";

export default class UtilitiesPage {
  readonly page: Page;
  public utilities: {
    utilitiesModule: Locator;
    ChangeBillingCounter: Locator;
    counters: Locator;
    counterItem: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.utilities = {
      utilitiesModule: page.locator("//span[text()='Utilities']"),
      ChangeBillingCounter: page.locator(
        '//a[text()= " Change Billing Counter "]'
      ),
      counters: page.locator("//div[@class='modelbox-div clearfix']"),
      counterItem: page.locator("//div[@class='counter-item']"),
    };
  }

  /**
 * @Test2 This method verifies the load time and selection of a billing counter.
 * 
 * @description Navigates to the Utilities module, opens the Change Billing Counter modal, 
 *              and measures the load time of the modal. If the modal loads within an acceptable
 *              time limit, the method selects the first available billing counter. If no counters
 *              are available, it logs a message. The function handles errors gracefully and logs 
 *              any exceptions encountered.
 * @return boolean - Returns true if the modal loads within the acceptable time and a counter is 
 *                   successfully selected. Returns false if the load time exceeds the limit or no
 *                   counter items are available.
 */
  async verifyBillingCounterLoadState(): Promise<boolean> {
    try {
      // Navigate to Utilities Module
      await CommonMethods.highlightElement(this.utilities.utilitiesModule);
      await this.utilities.utilitiesModule.click();

      // Click on Change Billing Counter and measure load time
      await CommonMethods.highlightElement(this.utilities.ChangeBillingCounter);
      await this.utilities.ChangeBillingCounter.click();

      const startTime = performance.now();
      // Wait for the counter modal to appear
      await this.page.waitForSelector("//div[@class='modelbox-div clearfix']");
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      const acceptableLoadTime = 1000; // 1 second as acceptable load time
      if (loadTime > acceptableLoadTime) {
        console.warn(`Page load time exceeded acceptable limit: ${loadTime}ms`);
        return false;
      }

      expect(loadTime).toBeLessThan(acceptableLoadTime);

      // Select first counter item if available
      const counterCount = await this.utilities.counterItem.count();
      if (counterCount > 0) {
        await CommonMethods.highlightElement(this.utilities.counterItem.first());
        await this.utilities.counterItem.first().click();
        return true;
      } else {
        console.log("No counter items available");
        return false;
      }
    } catch (error) {
      console.error("Error verifying billing counter load and selection:", error);
      return false;
    }
  }
}
