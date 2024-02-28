import { test, expect } from '@playwright/test';
import { describe } from 'node:test';

describe('bouncing balls', () => {
    test('page should render correctly', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await expect(page.getByText('Click here to add a ball')).toBeVisible();
    });
    test('clicking on the canvas should hide the hint', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.click('canvas');
        await expect(page.getByText('Click here to add a ball')).not.toBeVisible();
    });
});
