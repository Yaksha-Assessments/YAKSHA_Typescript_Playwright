import { Locator, Page } from "@playwright/test";
import { CommonMethods } from "../tests/commonMethods";

export class LoginPage {
  readonly page: Page;
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private loginErrorMessage: Locator;
  private admin: Locator;
  private logOut: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator(`#username_id`);
    this.passwordInput = page.locator(`#password`);
    this.loginButton = page.locator(`#login`);
    this.loginErrorMessage = page.locator(
      `//div[contains(text(),"Invalid credentials !")]`
    );
    this.admin = page.locator('//li[@class="dropdown dropdown-user"]');
    this.logOut = page.locator("//a[text() = ' Log Out ']");
  }

  async navigate() {
    await this.page.goto("/");
  }

  /**
   * @Test1 This method logs in the user with valid credentials.
   *
   * @param username - The username used for login.
   * @param password - The password used for login.
   * @description Attempts to log in using the provided username and password. Highlights input fields
   *              during interaction and checks for successful login by verifying the visibility of the
   *              'admin' element post-login.
   * @return boolean - Returns true if login is successful, otherwise false.
   */
  async performLogin(username: string, password: string): Promise<boolean> {
    let isUserLoggedIn = false;
    try {
      // Highlight and fill username field
      await CommonMethods.highlightElement(this.usernameInput);
      await this.usernameInput.fill(username);

      // Highlight and fill password field
      await CommonMethods.highlightElement(this.passwordInput);
      await this.passwordInput.fill(password);

      // Highlight and click login button
      await CommonMethods.highlightElement(this.loginButton);
      await this.loginButton.click();

      // Verify successful login by checking 'admin' element visibility
      await this.admin.waitFor({ state: "visible", timeout: 20000 });
      if (await this.admin.isVisible()) {
        isUserLoggedIn = true;
      }
    } catch (e) {
      console.error("Error during login:", e);
      return isUserLoggedIn;
    }
    return isUserLoggedIn;
  }

  /**
   * @Test18 This method attempts login with invalid credentials and retrieves the resulting error message.
   *
   * @param username - The username to use for the login attempt.
   * @param password - The password to use for the login attempt.
   * @description Tries logging in with incorrect credentials to verify the login error message display.
   *              Highlights each input field and the login button during interaction. Captures and returns
   *              the error message displayed upon failed login attempt.
   * @return string - Returns the error message displayed after a failed login attempt, trimmed of whitespace.
   *                  Throws an error if the error message could not be retrieved.
   */
  async performLoginWithInvalidCredentials(
    username: string,
    password: string
  ): Promise<string> {
    let errorMessage = ""; // Initialize variable to hold the error message

    try {
      // Highlight and click admin (to reset the state if logged in)
      await CommonMethods.highlightElement(this.admin);
      await this.admin.click();

      // Highlight and click Log Out (if previously logged in)
      await CommonMethods.highlightElement(this.logOut);
      await this.logOut.click();

      // Highlight and fill username field
      await CommonMethods.highlightElement(this.usernameInput);
      await this.usernameInput.fill(username);

      // Highlight and fill password field
      await CommonMethods.highlightElement(this.passwordInput);
      await this.passwordInput.fill(password);

      // Highlight and click login button
      await CommonMethods.highlightElement(this.loginButton);
      await this.loginButton.click();

      // Fetch and return the error message
      errorMessage = (await this.loginErrorMessage.textContent()) || "";
      console.log(`Error message displayed: ${errorMessage.trim()}`);
    } catch (error) {
      console.error("Error during login with invalid credentials:", error);
      throw new Error(
        "Login failed, and error message could not be retrieved."
      ); // Re-throw or handle as needed
    }

    return errorMessage.trim(); // Return the error message, trimmed of whitespace
  }
}
