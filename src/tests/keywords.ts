import { expect, Page } from "@playwright/test";

export class Keyword {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Keyword: SearchPatient
  async SearchPatient() {
    // Get the list of patient elements based on the provided locator
    await this.page.waitForSelector(
      "//div[@role='gridcell' and @col-id='ShortName'][1]"
    );

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
      // Assuming `searchBarLocator` is the locator for the search input field
      const searchBarLocator = this.page.locator("#quickFilterInput");

      // Wait for the search bar to be visible
      await searchBarLocator.waitFor({ state: "visible" });

      // Fill the search bar with the randomly selected patient name
      await searchBarLocator.fill(patientName);
      await searchBarLocator.press("Enter");

      // Wait for a short period to allow search results to load
      await this.page.waitForTimeout(1000); // You can also replace this with a more specific wait if there's a loading indicator

      // Log the patient name that is being searched for
      console.log(`Searching for patient: ${patientName}`);
    } else {
      console.warn("Patient name could not be extracted.");
    }

    return patientName; // Return the selected patient name for verification
  }

  // Keyword: VerifyResults
  async VerifyResults(patientName: string) {
    // Wait for the search results to be visible
    const resultLocator = this.page.locator(
      "//div[@role='gridcell' and @col-id='ShortName']"
    );
    await resultLocator.waitFor({ state: "visible" });

    // Fetch all results
    const results = await resultLocator.allTextContents();

    // Assert that the expected name appears in the results
    expect(results).toContain(patientName);
  }
}
