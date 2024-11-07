import { Page, Locator } from "playwright";
import { CommonMethods } from "../tests/commonMethods";
import { expect } from "playwright/test";

export default class LaboratoryPage {
  private page: Page;
  private laboratoryLink: Locator;
  private laboratoryDashboard: Locator;
  private settingsSubModule: Locator;
  private addNewLabTest: Locator;
  private addButton: Locator;
  private closeButton: Locator;
  private starIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.laboratoryLink = page.locator('a[href="#/Lab"]');
    this.laboratoryDashboard = page.locator('a[href="#/Lab/Dashboard"]');
    this.settingsSubModule = page.locator('(//a[@href="#/Lab/Settings"])[2]');
    this.addNewLabTest = page.locator(
      '//a[contains(text(),"Add New Lab Test")]'
    );
    this.addButton = page.locator('//button[contains(text(),"Add")]');
    this.closeButton = page.locator('//button[contains(text(),"Close")]');
    this.starIcon = page.locator('i[title="Remember this Date"]');
  }

  public get getErrorMessageLocator() {
    return (errorMessage: string) => {
      return this.page.locator(
        `//p[contains(text(),"error")]/../p[contains(text(),"${errorMessage}")]`
      );
    };
  }

  /**
   * @Test6 This method verifies the error message when attempting to add a new lab test without entering required values.
   *
   * @description Navigates to Laboratory > Settings, selects "Add New Lab Test," and clicks the Add button without
   *              providing any input. Captures and returns the displayed error message. If the modal fails to close,
   *              an error is thrown to indicate failure.
   *
   * @return string - The error message text, trimmed of any whitespace.
   */
  async verifyErrorMessage(): Promise<string> {
    let errorMessageText = "";
    try {
      // Navigate to Laboratory > Settings
      await CommonMethods.highlightElement(this.laboratoryLink);
      await this.laboratoryLink.click();

      await CommonMethods.highlightElement(this.settingsSubModule);
      await this.settingsSubModule.click();

      // Click on Add New Lab Test
      await CommonMethods.highlightElement(this.addNewLabTest);
      await this.addNewLabTest.click();

      // Click on Add button without entering any values
      await CommonMethods.highlightElement(this.addButton);
      await this.addButton.click();

      // Capture the error message text
      const errorLocator = this.getErrorMessageLocator(
        "Lab Test Code Required."
      );
      await expect(errorLocator).toBeVisible();
      errorMessageText = (await errorLocator.textContent()) || "";
      console.log(`Error message text: ${errorMessageText}`);

      // Close the modal
      await CommonMethods.highlightElement(this.closeButton);
      await this.closeButton.click();
    } catch (e) {
      console.error("Error verifying error message:", e);
      throw new Error("Failed to verify error message and close modal");
    }

    return errorMessageText.trim();
  }

  /**
   * @Test15 This method verifies the tooltip text of the star icon in the laboratory dashboard.
   *
   * @description This function navigates to the laboratory page and dashboard, hovers over the star icon, and
   *              waits for the tooltip to appear. It verifies the visibility of the star icon and retrieves the tooltip
   *              text by accessing the 'title' attribute. If an error occurs during the process, it logs the error and throws
   *              an exception. The tooltip text is returned after trimming any extra spaces.
   * @return string - Returns the tooltip text of the star icon, or an empty string if no tooltip is found.
   */

  async verifyStarTooltip(): Promise<string> {
    let tooltipText = "";
    try {
      await CommonMethods.highlightElement(this.laboratoryLink);
      await this.laboratoryLink.click();

      await CommonMethods.highlightElement(this.laboratoryDashboard);
      await this.laboratoryDashboard.click();

      // Hover over the star icon
      await this.starIcon.hover();

      // Wait for the tooltip to appear and verify its visibility
      await expect(this.starIcon).toBeVisible();

      // Get the tooltip text
      tooltipText = (await this.starIcon.getAttribute("title")) || "";
      console.log(`Tooltip text: ${tooltipText}`);
    } catch (e) {
      console.error("Error retrieving tooltip text:", e);
      throw new Error("Tooltip text could not be retrieved");
    }

    // Return the tooltip text
    return tooltipText.trim();
  }
}
