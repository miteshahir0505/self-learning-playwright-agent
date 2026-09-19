import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Add to Cart - implemented from AI-generated test cases', () => {
  test('TC-001 Add a single product to cart successfully', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await login.goto();
    await login.login('standard_user', 'secret_sauce');
    expect(await inventory.isOnInventoryPage()).toBe(true);

    await inventory.productAddButton('sauce-labs-backpack').click();

    await expect(inventory.productRemoveButton('sauce-labs-backpack')).toBeVisible();
    await expect(inventory.cartBadge).toHaveText('1');
  });

  test('TC-003 Remove item from cart via inventory page', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await login.goto();
    await login.login('standard_user', 'secret_sauce');

    await inventory.productAddButton('sauce-labs-backpack').click();
    await expect(inventory.cartBadge).toHaveText('1');

    await inventory.productRemoveButton('sauce-labs-backpack').click();

    await expect(inventory.productAddButton('sauce-labs-backpack')).toBeVisible();
    await expect(inventory.cartBadge).toHaveCount(0);
  });

  test('TC-004 Cart badge is hidden when no items are in cart', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await login.goto();
    await login.login('standard_user', 'secret_sauce');

    await expect(inventory.cartBadge).toHaveCount(0);
  });
});