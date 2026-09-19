import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly cartBadge: Locator;

  constructor(private page: Page) {
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  productAddButton(productSlug: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${productSlug}"]`);
  }

  productRemoveButton(productSlug: string): Locator {
    return this.page.locator(`[data-test="remove-${productSlug}"]`);
  }

  async openCart() {
    await this.page.locator('.shopping_cart_link').click();
  }

  async isOnInventoryPage(): Promise<boolean> {
    return this.page.url().includes('inventory.html');
  }
}