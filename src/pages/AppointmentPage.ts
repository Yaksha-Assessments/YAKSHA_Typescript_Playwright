import { Page, expect, Locator } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";
import { PatientSearchHelper } from "../tests/reusableMethod";
import { Keyword } from "../tests/keywords";
export default class AppointmentPage {
  readonly page: Page;
  public appointment: {
    appointmentLink: Locator;
    titleName: Locator;
    searchBar: Locator;
    patientName: Locator;
    hospitalSearchBar: Locator;
    patientCode: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.appointment = {
      appointmentLink: page.locator('a[href="#/Appointment"]'),
      titleName: page.locator("//span[text() = 'Patient List |']"),
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
 * @Test3.1
 * Navigates to the Appointment page by clicking on the Appointment link.
 * This method should be called to ensure the user is on the Appointment page before further actions.
 */
  async navigateToAppointmentPage() {
    await this.appointment.appointmentLink.click();
  }

  /**
 * @Test3.2
 * Selects the first patient in the patient list, verifies visibility,
 * and returns the patient name as a string.
 * Useful for validating patient selection actions.
 *
 * @returns {Promise<string>} - The name of the first patient in the list.
 */
  async selectFirstPatient() {
    await expect(this.appointment.patientName.first()).toBeVisible();
    const val = await this.appointment.patientName.first().innerText();
    return val;
  }

  /**
 * @Test3.3
 * Searches for a patient by entering the provided patient name into the search bar
 * and pressing Enter. This method can be used to filter patient records.
 *
 * @param {string} patientName - The name of the patient to search for.
 */
  async searchPatient(patientName: string) {
    await this.appointment.searchBar.fill(patientName);
    await this.appointment.searchBar.press("Enter");
    await this.page.waitForTimeout(1000);
  }

  /**
 * @Test3.4
 * Verifies that the search results contain the specified patient name by
 * checking the 'ShortName' column in the grid.
 * 
 * @param {string} patientName - The expected patient name to verify in the search results.
 */
  async verifypatientName(patientName: string) {
    await this.page.waitForTimeout(3000);
    await expect(
      this.page.locator("//div[@role='gridcell' and @col-id='ShortName']")
    ).toBeVisible();
    const resultList = this.page.locator(
      "//div[@role='gridcell' and @col-id='ShortName']"
    );
    await this.page.waitForTimeout(3000);
    await expect(resultList).toContainText(patientName);
  }

  /**
   * @Test14 This method searches and verifies the patient list in the appointment section.
   *
   * @description This function navigates to the appointment page, waits for the patient list to load, and verifies
   *              the visibility of the first patient in the list. It then searches for the first patient's name in
   *              the search bar and checks if the results match the search term. The function repeats the process for
   *              the patient's hospital search code, ensuring that both the name and code are correctly matched in the
   *              search results. If all the checks pass, it returns true; otherwise, it returns false.
   * @return boolean - Returns true if the search and verification process is successful, otherwise false.
   */

  async searchAndVerifyPatientList(): Promise<boolean> {
    try {
      // Navigate to the appointment page
      await CommonMethods.highlightElement(this.appointment.appointmentLink);
      await this.appointment.appointmentLink.click();
      // Wait for the patient list page to be visible
      await CommonMethods.highlightElement(this.appointment.titleName);
      await this.appointment.titleName.isVisible();
      // Verify the first patient name
      await CommonMethods.highlightElement(
        this.appointment.patientName.first()
      );
      await expect(this.appointment.patientName.first()).toBeVisible();
      // Get the name of the first patient
      const searchName = await this.appointment.patientName.first().innerText();
      // Fill the search bar with the patient's name and press Enter
      await CommonMethods.highlightElement(this.appointment.searchBar);
      await this.appointment.searchBar.fill(searchName);
      await this.appointment.searchBar.press("Enter");
      // Wait for the results to load
      await this.page.waitForTimeout(3000);
      // Locate all patient names in the search results
      const patientNames = await this.page.locator(
        "//div[@role='gridcell' and @col-id='ShortName']"
      );
      // Verify that each patient's name in the result matches the search term
      const patientNamecount = await patientNames.count();
      const maxChecks = Math.min(patientNamecount, 20); // Limit checks to 20 results
      for (let i = 0; i < maxChecks; i++) {
        const name = await patientNames.nth(i).innerText();
        expect(name).toEqual(searchName);
      }
      // Get the name of the first patient
      const HospitalsearchCode = await this.appointment.patientCode
        .first()
        .innerText();
      // Fill the search bar with the patient's name and press Enter
      await CommonMethods.highlightElement(this.appointment.hospitalSearchBar);
      await this.appointment.hospitalSearchBar.fill(HospitalsearchCode);
      await this.appointment.hospitalSearchBar.press("Enter");
      // Wait for the results to load
      await this.page.waitForTimeout(3000);
      // Locate all patient names in the search results
      const patientCode = this.page.locator(
        "//div[@role='gridcell' and @col-id='PatientCode']"
      );
      // Verify that each patient's name in the result matches the search term
      const patientCodecount = await patientCode.count();
      const maxCheck = Math.min(patientCodecount, 20); // Limit checks to 20 results
      for (let i = 0; i < maxCheck; i++) {
        const code = await patientCode.nth(i).innerText();
        expect(code).toEqual(HospitalsearchCode);
      }
      // Return true if all assertions pass
      return true;
    } catch (error) {
      console.error(`Error in searchAndVerifyPatientList: ${error}`);
      return false;
    }
  }

  /**
   * @Test11.1 This method performs a patient search in the appointment section using reusable function.
   *
   * @description This function highlights the appointment link, clicks on it to navigate to the appointment page,
   *              waits for the page to load, and triggers the patient search action using a helper function.
   *              It ensures that the patient search is executed successfully and returns true if the search operation is completed.
   * @return boolean - Returns true if the patient search is successful, otherwise false.
   */

  async searchPatientInAppointment(): Promise<boolean> {
    try {
      const patientSearchHelper = new PatientSearchHelper(this.page);
      await CommonMethods.highlightElement(this.appointment.appointmentLink);
      await this.appointment.appointmentLink.click();
      await this.page.waitForTimeout(2000);
      await patientSearchHelper.searchPatient();
      return true;
    } catch (e) {
      console.error("Error selecting random counter:", e);
      return false;
    }
  }

  /**
   * @Test10 This method is part of a keyword-driven test that searches for a patient and verifies the results.
   *
   * @description This function, as part of a keyword-driven test, successfully navigates to the appointment page,
   *              waits for the relevant page elements to become visible, and performs a patient search using the
   *              `SearchPatient` function. It then verifies the search results using the `VerifyResults` function.
   *              The test should successfully search for a patient and verify the results, ensuring accurate data handling.
   * @return boolean - Returns true if the patient search and verification are successful, otherwise false.
   */

  async searchAndVerifyPatient(): Promise<boolean> {
    try {
      const keyword = new Keyword(this.page);
      await this.page.waitForTimeout(2000);
      await CommonMethods.highlightElement(this.appointment.appointmentLink);
      await this.appointment.appointmentLink.click();
      // Verify successful login by checking 'admin' element visibility
      await this.appointment.titleName.waitFor({
        state: "visible",
        timeout: 10000,
      });
      await this.page.waitForTimeout(2000);
      // Call the SearchPatient function and get the patient name
      const patientName = await keyword.SearchPatient();
      // Ensure that a valid patient name was retrieved
      if (!patientName) {
        console.error("No patient name found to search for.");
        return false; // Return false if no patient name is found
      }
      // Call VerifyResults to validate if the patient appears in search results
      await keyword.VerifyResults(patientName);
      return true;
    } catch (e) {
      console.error("Error selecting random counter:", e);
      return false;
    }
  }
}
