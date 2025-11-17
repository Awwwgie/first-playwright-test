import {test, expect} from '@playwright/test';

test.describe('Homepage Tests', () => {
test('Check if the Internet page loads', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');
    await expect(page).toHaveURL('https://the-internet.herokuapp.com/');
    });

    test('A/B Testing link works and page loads correctly', async ({page}) => {
        await page.goto('https://the-internet.herokuapp.com/');
        await page.getByRole('link', { name: 'A/B Testing' }).click();
        await expect(page).toHaveURL(/abtest/);
        await expect(page.getByRole('heading', {level: 3})).toContainText(/A\/B Test/);
    })
})