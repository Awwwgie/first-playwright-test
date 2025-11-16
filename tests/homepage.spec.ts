import {test, expect} from '@playwright/test';

test.describe('Homepage Tests', () => {
test('Check if the internet page loads', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');
    await expect(page).toHaveURL('https://the-internet.herokuapp.com/');
    });
});
