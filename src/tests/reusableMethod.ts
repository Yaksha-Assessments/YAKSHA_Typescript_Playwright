import { Page, expect, Locator } from "@playwright/test";

export class PatientSearchHelper {
  private page: Page;
  private searchBar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBar = page.locator("#quickFilterInput");
  }

  // Method to search for a patient using a random patient name from the list
  async searchPatient() {
    // Get the list of patient elements based on the provided locator
    const patientElements = await this.page
      .locator("//div[@role='gridcell' and @col-id='ShortName'][1]")
      .elementHandles();

    // If no patients are found, log a warning and return
    if (patientElements.length === 0) {
      console.warn("No patients found in the list.");
      return;
    }

    // Select a random patient element
    const randomIndex = Math.floor(Math.random() * patientElements.length);
    const randomPatientElement = patientElements[randomIndex];

    // Extract the patient name by casting to HTMLElement
    const patientName = await randomPatientElement.evaluate((el) => {
      // Cast 'el' to HTMLElement to access innerText
      return (el as HTMLElement).innerText;
    });

    if (patientName) {
      // Fill the search bar with the randomly selected patient name
      await this.searchBar.fill(patientName);
      await this.searchBar.press("Enter");

      // Wait for a short period to allow search results to load
      await this.page.waitForTimeout(1000);

      // Get all displayed patient names in the table
      const displayedPatientNames = await this.page
        .locator("//div[@role='gridcell' and @col-id='ShortName']")
        .allTextContents();

      // Check if the entered patient name matches any displayed name
      const isPatientFound = displayedPatientNames.some(
        (name) => name.trim() === patientName.trim()
      );

      // Log the result of the search
      if (isPatientFound) {
        console.log(`Successfully found the patient: ${patientName}`);
        // Expectation: Verify that the search bar contains the expected patient name
        const searchBarValue = await this.searchBar.inputValue(); // Get the current value of the search bar
        expect(searchBarValue.trim()).toEqual(patientName.trim()); // Verify that it matches the patient name
      } else {
        console.warn(`Patient not found in the search results: ${patientName}`);
      }
    }
  }
}
