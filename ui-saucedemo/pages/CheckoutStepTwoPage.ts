import { Page, Locator } from '@playwright/test';

export class CheckoutStepTwoPage {
  readonly page: Page;
  readonly title: Locator;
  readonly itemNames: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.finishButton = page.locator('[data-test="finish"]');
  }

  async clickFinish() {
    await this.finishButton.click();
  }
}
