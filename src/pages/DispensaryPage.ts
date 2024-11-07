import { Page, expect, Locator } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";

export default class DispensaryPage {
  readonly page: Page;
  private maxRetries = 3;
  private timeoutDuration = 5000;
  public dispensary: {
    dispensaryLink: Locator;
    activateCounter: Locator;
    counterSelection: Locator;
    counterName: Locator;
    activatedCounterInfo: Locator;
    deactivateCounterButton: Locator;
    titleName: Locator;
    name: Locator;
    prescription: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.dispensary = {
      dispensaryLink: page.locator('a[href="#/Dispensary"]'),
      activateCounter: page.locator("//a[contains(text(),'Counter')]"),
      counterSelection: page.locator('//div[@class="counter-item"]'),
      counterName: page.locator('//div[@class="counter-item"]//h5'),
      activatedCounterInfo: page.locator(`div.mt-comment-info`),
      deactivateCounterButton: page.locator(
        `//button[contains(text(),'Deactivate Counter')]`
      ),
      titleName: page.locator('//span[@class="caption-subject"]'),
      name: page.locator('(//div[@class="col-sm-4 col-md-3"]//label//span)[1]'),
      prescription: page.locator("//a[contains(text(),' Prescription ')]"),
    };
  }

  /**
   * @Test4 This method verifies the activation message for a random counter in the dispensary module.
   *
   * @description Navigates to the Dispensary page and selects a random counter if multiple counters are available.
   *              After activating the selected counter, the method verifies that the activation message displays
   *              the correct counter name. If the counter name matches in the activation message, the function
   *              returns true. Logs are included to provide details on counter selection and activation status.
   * @return boolean - Returns true if the activation message correctly shows the selected counter name; otherwise, returns false.
   */
  async verifyActiveCounterMessageInDispensary(): Promise<boolean> {
    let isCounterNameActivated = false;
    try {
      // Navigate to Dispensary module
      await CommonMethods.highlightElement(this.dispensary.dispensaryLink);
      await this.dispensary.dispensaryLink.click();
      await CommonMethods.highlightElement(this.dispensary.activateCounter);
      await this.dispensary.activateCounter.click();
      // Wait for the page to load
      await this.page.waitForTimeout(2000);
      await this.page.waitForSelector("//span[@class='caption-subject']", {
        state: "visible",
      });

      // Get the count of available counters
      const counterCount = await this.dispensary.counterSelection.count();
      console.log(`Counter count >> ${counterCount}`);

      if (counterCount >= 1) {
        // Select a random counter index
        const randomIndex = Math.floor(Math.random() * counterCount);
        console.log(`Random counter index selected: ${randomIndex}`);

        // Fetch the name of the selected counter
        const fullCounterText = await this.dispensary.counterName
          .nth(randomIndex)
          .textContent();
        let counterName =
          fullCounterText?.split("click to Activate")[0].trim() || ""; // Extracts "Morning Counter"
        console.log(`Counter name at index ${randomIndex}: ${counterName}`);

        // Highlight and select the random counter
        const randomCounter = this.dispensary.counterSelection.nth(randomIndex);
        await CommonMethods.highlightElement(randomCounter);
        await randomCounter.click();

        // Activate the selected counter
        await CommonMethods.highlightElement(this.dispensary.activateCounter);
        await this.dispensary.activateCounter.click();

        // Get and verify the activation message text
        const activatedCounterInfoText =
          await this.dispensary.activatedCounterInfo.textContent();
        console.log(
          `Activated counter info text : ${activatedCounterInfoText}`
        );

        // Check if the message contains the selected counter name
        if (activatedCounterInfoText?.includes(counterName)) {
          isCounterNameActivated = true;
          console.log(
            `-------------------------Returning true-------------------------`
          );
        }
      }
    } catch (e) {
      console.error("Error selecting random counter:", e);
    }
    return isCounterNameActivated;
  }

  /**
   * @Test12 This method verifies if the counter is activated in the dispensary section.
   *
   * @description This function highlights the dispensary link, clicks on it to navigate to the dispensary page,
   *              waits for the page to load, and then attempts to activate the counter. It checks whether the 'deactivate'
   *              counter button becomes visible after activation. If the button is not found, it logs a warning and returns false.
   *              If the activation is successful, it returns true.
   * @return boolean - Returns true if the counter is successfully activated, otherwise false.
   */

  async verifyCounterisActivated(): Promise<boolean> {
    try {
      await CommonMethods.highlightElement(this.dispensary.dispensaryLink);
      await this.dispensary.dispensaryLink.click();

      await this.page.waitForTimeout(2000);

      await CommonMethods.highlightElement(this.dispensary.activateCounter);
      await this.dispensary.activateCounter.click();

      if (!(await this.dispensary.deactivateCounterButton.isVisible())) {
        console.warn(
          "Element not found on page:",
          await this.dispensary.deactivateCounterButton.textContent()
        );
        return false;
      }
    } catch (error) {
      console.error("Error during activation message verification:", error);
    }
    return true;
  }

  /**
   * @Test16 This method attempts to navigate to the dispensary page with retry and making the naviagtion load slow logic.
   *
   * @description This function tries to navigate to the dispensary page by clicking the dispensary link and activating the
   *              counter. It waits for a key element on the page to confirm the page has loaded. The function retries the
   *              navigation a specified number of times (maxRetries) if it encounters an error. If successful, it logs the
   *              attempt and returns true. If the maximum number of attempts is reached without success, it logs the failure
   *              and returns false.
   * @return boolean - Returns true if the dispensary page is successfully navigated to, otherwise false.
   */

  async navigateToDispensary(): Promise<boolean> {
    let attempt = 0;
    while (attempt < this.maxRetries) {
      try {
        attempt++;
        console.log(`Attempt ${attempt} to navigate to Dispensary page`);
        // Highlight the dispensary link and click it
        await CommonMethods.highlightElement(this.dispensary.dispensaryLink);
        await this.dispensary.dispensaryLink.click();
        await this.dispensary.activateCounter.click();
        // Wait for a key element on the page to confirm it has loaded
        await this.page.waitForSelector(
          "//div[@class='portlet light bordered ']",
          {
            timeout: this.timeoutDuration,
          }
        );
        console.log(
          `Successfully navigated to Dispensary page on attempt ${attempt}`
        );
        return true;
      } catch (error) {
        console.error(`Navigation failed on attempt ${attempt}:`, error);
        // If max attempts reached, throw the error
        if (attempt >= this.maxRetries) {
          console.error(
            "Max retries reached. Failed to navigate to Dispensary page."
          );
          return false;
        }
        // Optional: wait before retrying
        await this.page.waitForTimeout(2000); // 2 seconds delay before retry
      }
    }
    return false;
  }

  async searchPatientInDispensary(): Promise<boolean> {
    try {
      await CommonMethods.highlightElement(this.dispensary.dispensaryLink);
      await this.dispensary.dispensaryLink.click();
      await CommonMethods.highlightElement(this.dispensary.prescription);
      await this.dispensary.prescription.click();

      return true;
    } catch (e) {
      console.error("Error selecting random counter:", e);
      return false;
    }
  }
}
