import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

const PRODUCT = 'Sauce Labs Onesie';

test.describe('E2E Checkout Flow', () => {
  test('user can checkout Sauce Labs Onesie', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOne = new CheckoutStepOnePage(page);
    const checkoutStepTwo = new CheckoutStepTwoPage(page);
    const checkoutComplete = new CheckoutCompletePage(page);

    await test.step('Login', async () => {
      await loginPage.goto();
      await loginPage.fillUsername('standard_user');
      await loginPage.fillPassword('secret_sauce');
      await loginPage.clickLogin();
      await expect(inventoryPage.title).toHaveText('Products');
    });

    await test.step(`Add item '${PRODUCT}' to cart`, async () => {
      await inventoryPage.clickAddToCart(PRODUCT);
      await expect(inventoryPage.cartBadge).toHaveText('1');
    });

    await test.step('Go to cart', async () => {
      await inventoryPage.clickCartIcon();
      await expect(cartPage.title).toHaveText('Your Cart');
      await expect(cartPage.cartItems).toHaveText(PRODUCT);
    });

    await test.step('Proceed checkout', async () => {
      await cartPage.clickCheckout();
      await expect(checkoutStepOne.title).toHaveText('Checkout: Your Information');

      await checkoutStepOne.fillFirstName('Zaaf');
      await checkoutStepOne.fillLastName('Hend');
      await checkoutStepOne.fillPostalCode('16113');
      await checkoutStepOne.clickContinue();

      await expect(checkoutStepTwo.title).toHaveText('Checkout: Overview');
      await expect(checkoutStepTwo.itemNames).toHaveText(PRODUCT);
      await checkoutStepTwo.clickFinish();
    });

    await test.step('Ensure checkout is completed and cart is empty', async () => {
      await expect(checkoutComplete.title).toHaveText('Checkout: Complete!');
      await expect(checkoutComplete.completeHeader).toHaveText('Thank you for your order!');

      await checkoutComplete.clickBackHome();

      await expect(inventoryPage.title).toHaveText('Products');
      await expect(inventoryPage.cartBadge).toHaveCount(0);
    });
  });
});
