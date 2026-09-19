import { expect, Page, test } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';

async function openCheckout(page: Page) {
  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  await login.goto();
  await login.login('standard_user', 'secret_sauce');
  await inventory.productAddButton('sauce-labs-backpack').click();
  await inventory.openCart();
  await cart.checkout();

  return { inventory, cart, checkout };
}

test.describe('Checkout flow - implemented from checkout-flow requirement', () => {
  test('TC-001 completes checkout and clears the cart badge', async ({ page }) => {
    const { inventory, checkout } = await openCheckout(page);

    await checkout.fillInformation('Test', 'User', '12345');
    await checkout.continueToOverview();
    await expect(checkout.summaryItems).toHaveCount(1);
    await expect(checkout.subtotal).toBeVisible();
    await expect(checkout.tax).toBeVisible();
    await expect(checkout.total).toBeVisible();

    await checkout.finish();

    await expect(checkout.confirmationMessage).toHaveText('Thank you for your order!');
    await expect(inventory.cartBadge).toHaveCount(0);
  });

  test('TC-002 rejects checkout information with all required fields empty', async ({ page }) => {
    const { checkout } = await openCheckout(page);

    await checkout.continueToOverview();

    await expect(checkout.errorMessage).toContainText('First Name is required');
    await expect(checkout.isOnInformationPage()).resolves.toBe(true);
  });

  test('TC-003 cancels checkout from the information page without losing cart contents', async ({ page }) => {
    const { cart, checkout } = await openCheckout(page);

    await checkout.firstNameInput.fill('Test');
    await checkout.cancel();

    await expect(cart.isOnCartPage()).resolves.toBe(true);
    await expect(cart.cartItems).toHaveCount(1);
  });

  test('TC-004 cancels checkout from the overview page and preserves the cart', async ({ page }) => {
    const { inventory, checkout } = await openCheckout(page);

    await checkout.fillInformation('Test', 'User', '12345');
    await checkout.continueToOverview();
    await checkout.cancel();

    await expect(inventory.isOnInventoryPage()).resolves.toBe(true);
    await expect(inventory.cartBadge).toHaveText('1');
  });

  test('TC-005 displays item and price summary details on the overview page', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await login.goto();
    await login.login('standard_user', 'secret_sauce');
    await inventory.productAddButton('sauce-labs-backpack').click();
    await inventory.productAddButton('sauce-labs-bike-light').click();
    await inventory.openCart();
    await cart.checkout();
    await checkout.fillInformation('Test', 'User', '12345');
    await checkout.continueToOverview();

    await expect(checkout.summaryItems).toHaveCount(2);
    await expect(checkout.subtotal).toContainText('$');
    await expect(checkout.tax).toContainText('$');
    await expect(checkout.total).toContainText('$');
  });

  test.fixme('TC-008 PDF receipt is available and downloadable', async ({ page }) => {
    const { checkout } = await openCheckout(page);

    await checkout.fillInformation('Test', 'User', '12345');
    await checkout.continueToOverview();
    await checkout.finish();

    await expect(checkout.generatePdfButton).toBeVisible();
    const downloadPromise = page.waitForEvent('download');
    await checkout.generateReceiptPdf();
    await downloadPromise;
  });

  test.fixme('TC-006 does not place an order when the network is interrupted', async ({ page }) => {
    const { checkout } = await openCheckout(page);

    await checkout.fillInformation('Test', 'User', '12345');
    await checkout.continueToOverview();
    await page.context().setOffline(true);
    await checkout.finish();

    await expect(checkout.isOrderComplete()).resolves.toBe(false);
  });

  test.fixme('TC-007 resumes checkout after the network is restored', async ({ page }) => {
    const { checkout } = await openCheckout(page);

    await page.context().setOffline(true);
    await page.context().setOffline(false);
    await checkout.fillInformation('Test', 'User', '12345');
    await checkout.continueToOverview();
    await checkout.finish();

    await expect(checkout.confirmationMessage).toBeVisible();
  });
});
