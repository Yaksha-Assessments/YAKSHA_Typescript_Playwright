# Playwright Project

This project uses Playwright to automate and test the web application. It includes test cases written in TypeScript to ensure reliable functionality across modules.

## Setup

To get started with the project, make sure you have [Node.js](https://nodejs.org/) installed, then follow these steps:

1. **Clone the Repository**  
   Clone the project repository to your local machine if you haven't already.

   ```bash 
   git clone <your-repository-url>```

2. **Install Dependencies**
    Install all required npm packages for Playwright and other dependencies.
    ```npm install```

3. **Install Playwright Browsers**
    Playwright requires specific browser binaries. You can install them by running:
    ```npx playwright install```

4. **Running Tests**
    To execute the test cases, use the following command. This will run a specific test file located in
    ```npx playwright test ./src/tests/PL1_testcases/yaksha_PL1_testcases.spec.ts```
