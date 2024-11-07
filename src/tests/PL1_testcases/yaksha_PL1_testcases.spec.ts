import { expect, test } from "playwright/test";
import AppointmentPage from "../../pages/AppointmentPage";
import UtilitiesPage from "../../pages/UtilitiesPage";
import DispensaryPage from "../../pages/DispensaryPage";
import { LoginPage } from "../../pages/LoginPage";
import ProcurementPage from "../../pages/ProcurementPage";
import PatientPage from "../../pages/PatientPage";
import ADTPage from "../../pages/ADTPage";
import RadiologyPage from "../../pages/RadiologyPage";
import LaboratoryPage from "../../pages/LaboratoryPage";

test.describe("Appointment Page Test", () => {
  let appointmentPage: AppointmentPage;
  let utilitiesPage: UtilitiesPage;
  let dispensaryPage: DispensaryPage;
  let procurementPage: ProcurementPage;
  let loginPage: LoginPage;
  let patientPage: PatientPage;
  let adtPage: ADTPage;
  let radiologyPage: RadiologyPage;
  let laboratoryPage: LaboratoryPage;
  let context;

  test.beforeAll(async ({ browser: b }) => {
    context = await b.newContext();
    const page = await context.newPage();
    loginPage = new LoginPage(page);
    utilitiesPage = new UtilitiesPage(page);
    appointmentPage = new AppointmentPage(page);
    dispensaryPage = new DispensaryPage(page);
    procurementPage = new ProcurementPage(page);
    patientPage = new PatientPage(page);
    adtPage = new ADTPage(page);
    radiologyPage = new RadiologyPage(page);
    laboratoryPage = new LaboratoryPage(page);
    await page.goto("/");
  });

  test("TS-1 Login with valid credentials", async () => {
    let username: string = "admin";
    let password: string = "pass123";
    expect(await loginPage.performLogin(username, password)).toBeTruthy();
  });

  test("TS-2 Verify Page Navigation and Load Time for Billing Counter ", async () => {
    expect(await utilitiesPage.verifyBillingCounterLoadState()).toBeTruthy();
  });

  test("TS-3 Patient Search with Valid Data ", async () => {
    await appointmentPage.navigateToAppointmentPage();
    const patientName = await appointmentPage.selectFirstPatient();
    await appointmentPage.searchPatient(patientName);
    await appointmentPage.verifypatientName(patientName);
  });

  test("TS-4 Activate Counter in Dispensar", async () => {
    expect(
      await dispensaryPage.verifyActiveCounterMessageInDispensary()
    ).toBeTruthy();
  });

  test("TS-5 Purchase Request List Load", async () => {
    expect(
      await procurementPage.verifyPurchaseRequestListElements()
    ).toBeTruthy();
  });

  test("TS-6 Verify error message while adding new lab test in Laboratory", async () => {
    expect(await laboratoryPage.verifyErrorMessage()).toEqual(
      "Lab Test Code Required."
    );
  });

  test("TS-7 Handle Alert on Radiology Module", async () => {
    expect(
      await radiologyPage.performRadiologyRequestAndHandleAlert("01-01-2020")
    ).toBeTruthy();
  });

  test("TS-8 Data-Driven Testing for Patient Search", async () => {
    expect(await patientPage.searchAndVerifyPatients()).toBeTruthy();
  });

  test("TS-9 Error Handling and Logging in Purchase Request List", async () => {
    expect(
      await procurementPage.verifyNoticeMessageAfterEnteringIncorrectFilters()
    ).toEqual("Date is not between Range. Please enter again");
  });

  test("TS-10 Keyword-Driven Framework for Appointment Search", async ({
    page,
  }) => {
    expect(await appointmentPage.searchAndVerifyPatient()).toBeTruthy();
  });

  test("TS-11 Modular Script for Patient Search", async () => {
    expect(await appointmentPage.searchPatientInAppointment()).toBeTruthy();
    expect(await patientPage.searchPatientInPatientPage()).toBeTruthy();
    expect(await adtPage.searchPatientInADT()).toBeTruthy();
  });

  test("TS-12 Verify Assertion for Counter Activation", async () => {
    expect.soft(await dispensaryPage.verifyCounterisActivated()).toBeTruthy();
  });

  test("TS-14 Verify Locator Strategy for Appointment Search ", async () => {
    expect(await appointmentPage.searchAndVerifyPatientList()).toBeTruthy();
  });

  test("TS-15 Verify the tooltip and it's text present on hover the mouse on Star icon in Laboratory", async () => {
    expect(await laboratoryPage.verifyStarTooltip()).toEqual(
      "Remember this Date"
    );
  });

  test("TS-16 Navigation Exception Handling on Dispensary Page ", async () => {
    expect(await dispensaryPage.navigateToDispensary()).toBeTruthy();
  });

  test("TS-17 Web Element Handling for Dropdowns in Purchase Request", async () => {
    const fromDate = "01-01-2020";
    const getDate = new Date().getDate();
    const getMonth = new Date().getMonth();
    const getYear = new Date().getFullYear();
    console.log(`${getDate}-${getMonth}-${getYear}`);
    expect(
      await procurementPage.verifyRequestedDateCoulumnDateWithinRange(
        fromDate,
        `${getDate}-${getMonth}-${getYear}`
      )
    ).toBeTruthy();
  });

  test("TS-18 Login with invalid credentials", async () => {
    let username: string = "adminfr";
    let password: string = "jadfhfa";
    expect(
      await loginPage.performLoginWithInvalidCredentials(username, password)
    ).toEqual("Invalid credentials !");
  });
});
