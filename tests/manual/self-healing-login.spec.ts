import { test, expect } from '@playwright/test';
import { getWorkingSelector } from '../../src/agent/healSelector';

test.describe('Self-healing agent - login form', () => {
  test('heals a deliberately broken username selector', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');

    // Deliberately wrong selector (simulating drift - real id is #username)
    const brokenUsernameSelector = '#user-name-field';
    const workingSelector = await getWorkingSelector(
      page,
      brokenUsernameSelector,
      'the username input field on the login form'
    );

    await page.locator(workingSelector).fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('.flash.success')).toBeVisible();
  });
});