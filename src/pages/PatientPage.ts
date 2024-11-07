import { Page, expect, Locator } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";
import { PatientSearchHelper } from "../tests/reusableMethod";
import * as fs from "fs";
import patientData from "../Data/patientData.json";

// // Load patient search data from JSON file
// const patientData = JSON.parse(
//   fs.readFileSync(
//     "C:/Users/Yogesh/Desktop/Yaksha/YAKSHA_Typescript_Playwright/src/Data/patientData.json",
//     "utf-8"
//   )
// );

export default class PatientPage {
  readonly page: Page;
  public patient: {
    patientLink: Locator;
    searchBar: Locator;
    patientName: Locator;
    hospitalSearchBar: Locator;
    patientCode: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.patient = {
      patientLink: page.locator('a[href="#/Patient"]'),
      searchBar: page.locator("#quickFilterInput"),
      hospitalSearchBar: page.locator("#id_input_search_using_hospital_no"),
      patientName: page.locator(
        "//div[@role='gridcell' and @col-id='ShortName'][1]"
      ),
      patientCode: page.locator(
        "//div[@role='gridcell' and @col-id='PatientCode'][1]"
      ),
    };
  }

  /**
   * @Test11.2 This method performs a patient search in the appointment section using reusable function.
   *
   * @description This function highlights the appointment link, clicks on it to navigate to the appointment page,
   *              waits for the page to load, and triggers the patient search action using a helper function.
   *              It ensures that the patient search is executed successfully and returns true if the search operation is completed.
   * @return boolean - Returns true if the patient search is successful, otherwise false.
   */

  async searchPatientInPatientPage(): Promise<boolean> {
    try {
      const patientSearchHelper = new PatientSearchHelper(this.page);
      await CommonMethods.highlightElement(this.patient.patientLink);
      await this.patient.patientLink.click();
      await this.page.waitForTimeout(2000);
      await patientSearchHelper.searchPatient();
      return true;
    } catch (e) {
      console.error("Error selecting random counter:", e);
      return false;
    }
  }

  /**
   * @Test8 Searches for and verifies patients in the patient list.
   *
   * @description This method navigates to the patient section, iterates over a predefined list of patients, and performs
   *              a search operation for each patient name. After each search, it verifies that the search result matches
   *              the expected patient name. If all patients are verified successfully, it returns true; otherwise, false.
   * 
   * @returns {boolean} - Returns true if all patient searches are verified successfully; returns false if an error occurs.
   */
  async searchAndVerifyPatients(): Promise<boolean> {
    try {
      await CommonMethods.highlightElement(this.patient.patientLink);
      await this.patient.patientLink.click();
      await this.page.waitForTimeout(2000);

      const searchBar = this.patient.searchBar;
      await this.page.waitForTimeout(2000);

      for (let i = 0; i < 5; i++) {
        const patientName = patientData.Results[i].ShortName;

        // Enter patient name in the search bar
        await searchBar.fill(patientName);
        await this.page.keyboard.press("Enter");
        // Submit search
        await this.page.waitForTimeout(3000);
        // Retrieve the inner text of the result locator
        const resultText = await this.page
          .locator("//div[@role='gridcell' and @col-id='ShortName']")
          .innerText();
        await this.page.waitForTimeout(3000);
        // Verify the search result contains the patient name
        await expect(resultText.trim()).toEqual(patientName.trim());

        // Clear the search bar for the next patient search
        await searchBar.clear();
      }
      // If the loop completes without error, return true
      return true;
    } catch (error) {
      console.error("Error searching and verifying patients:", error);
      return false; // Return false if any error occurs
    }
  }
}
