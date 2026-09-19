import { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly summaryItems: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;
  readonly confirmationMessage: Locator;
  readonly backHomeButton: Locator;
  readonly generatePdfButton: Locator;

  constructor(private page: Page) {
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.summaryItems = page.locator('.cart_item');
    this.subtotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');
    this.confirmationMessage = page.locator('[data-test="complete-header"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.generatePdfButton = page.getByRole('button', { name: 'Generate PDF' });
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async generateReceiptPdf() {
    await this.generatePdfButton.click();
  }

  async isOnInformationPage(): Promise<boolean> {
    return this.page.url().includes('checkout-step-one.html');
  }

  async isOnOverviewPage(): Promise<boolean> {
    return this.page.url().includes('checkout-step-two.html');
  }

  async isOrderComplete(): Promise<boolean> {
    return this.page.url().includes('checkout-complete.html');
  }
}