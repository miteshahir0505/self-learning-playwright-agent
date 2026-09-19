import { test, expect } from '@playwright/test';
import { getWorkingSelector } from '../../src/agent/healSelector';
import * as path from 'path';

test.describe('Self-healing agent - dynamic ID page', () => {
  test('heals a selector against a randomly-generated element ID', async ({ page }) => {
    const fixturePath = path.resolve('fixtures/dynamic-id-page.html');
    await page.goto('file://' + fixturePath);

    // This selector will NEVER match, because the real ID is randomized per load
    const staticGuessSelector = '#submit-btn';

    const workingSelector = await getWorkingSelector(
      page,
      staticGuessSelector,
      'the Submit button below the username field'
    );

    await page.locator('#username-field').fill('mitesh');
    await page.locator(workingSelector).click();

    await expect(page.locator('#result')).toHaveText('Form submitted');
  });
});