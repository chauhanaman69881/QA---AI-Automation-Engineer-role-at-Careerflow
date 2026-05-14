# UI Automation Tests

This directory contains Playwright end-to-end tests using the **Page Object Model (POM)** pattern.

## Project Structure

```
tests/
├── auth.spec.ts              # Authentication test cases
└── [other test files].spec.ts

pages/
├── BasePage.ts               # Base page with common methods
├── LoginPage.ts              # Login page object
├── DashboardPage.ts          # Dashboard page object
└── [other page objects].ts

utils/                         # Utility functions (if needed)
playwright.config.ts           # Playwright configuration
package.json                   # Dependencies and scripts
tsconfig.json                  # TypeScript configuration
```

## Page Object Model (POM) Pattern

The POM pattern provides these benefits:
- **Maintainability**: Selectors are centralized in page objects
- **Reusability**: Common methods are shared across tests
- **Readability**: Tests read like documentation
- **Scalability**: Easy to add new pages and tests

### Example Structure:
```typescript
// pages/LoginPage.ts - Encapsulates login page selectors and methods
export class LoginPage extends BasePage {
  readonly emailInput = 'input[type="email"]';
  readonly passwordInput = 'input[type="password"]';
  
  async login(email: string, password: string) {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.click(this.loginButton);
  }
}

// tests/auth.spec.ts - Tests use page objects for clean, readable code
await loginPage.login('test@example.com', 'password');
expect(await dashboardPage.isUserLoggedIn()).toBe(true);
```

## Installation

```bash
npm install
```

This installs:
- `@playwright/test` - Testing framework
- `typescript` - TypeScript support

## Running Tests

```bash
# Run all tests (headless mode)
npm test

# Run with visual browser
npm run test:headed

# Run with Playwright Inspector (step through tests)
npm run test:debug

# Run with test UI (interactive mode)
npm run test:ui

# Generate test code using Codegen
npm run codegen
```

## Test File Naming

All test files use the `.spec.ts` extension:
- `auth.spec.ts` - Authentication tests
- `job-tracker.spec.ts` - Job tracker feature tests
- `profile.spec.ts` - User profile tests

## Writing New Tests

1. **Create a Page Object** (pages/YourPage.ts):
```typescript
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class YourPage extends BasePage {
  readonly element = 'selector';
  
  async performAction() {
    await this.click(this.element);
  }
}
```

2. **Create Test File** (tests/your-feature.spec.ts):
```typescript
import { test, expect } from '@playwright/test';
import { YourPage } from '../pages/YourPage';

test.describe('Your Feature', () => {
  test('TC-001: User can do something', async ({ page }) => {
    const yourPage = new YourPage(page);
    await yourPage.goto('/your-page');
    await yourPage.performAction();
    expect(await yourPage.isElementVisible('selector')).toBe(true);
  });
});
```

## Test Results

After running tests, view results:

```bash
# Open HTML report (automatically generated)
npx playwright show-report
```

Reports include:
- Test execution timeline
- Screenshots on failure
- Videos of failed tests
- Detailed logs

## CI/CD Integration

GitHub Actions workflow runs tests automatically on:
- Push to `main` or `develop` branches
- Pull requests targeting `main` or `develop`

View results in the **Actions** tab on GitHub. Artifacts include:
- HTML report
- JUnit XML report (for integration with other tools)

## Best Practices

✅ **Use Page Objects** - Centralize selectors and methods  
✅ **Meaningful Assertions** - Test behavior, not just navigation  
✅ **Avoid Hardcoded Waits** - Use Playwright's auto-waiting mechanisms  
✅ **Use Test IDs** - Add `data-testid` attributes to elements for stable selectors  
✅ **Comments** - Document why tests matter, not just what they do  
✅ **Parallel Execution** - Leverage Playwright's built-in parallelization  

## Troubleshooting

**Tests timing out?**
- Increase timeout in `playwright.config.ts` or individual tests
- Check internet connectivity

**Selectors not found?**
- Use Codegen: `npm run codegen`
- Verify selectors in browser DevTools
- Check for dynamic content loading

**Flaky tests?**
- Use `waitForPageLoad()` for dynamic pages
- Avoid hardcoded `setTimeout()` - use Playwright's built-in waiting
- Use `data-testid` attributes instead of CSS selectors when possible

## References

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
