import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(private page: Page) {
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/cart.html');
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  item(productName: string): Locator {
    return this.page.locator('.cart_item').filter({ hasText: productName });
  }

  removeButton(productSlug: string): Locator {
    return this.page.locator(`[data-test="remove-${productSlug}"]`);
  }

  async isOnCartPage(): Promise<boolean> {
    return this.page.url().includes('cart.html');
  }
}