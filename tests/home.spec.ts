import { test, expect } from '@playwright/test';


test.describe('webapp deve estar online', () => {
    test('home page', async ({ page }) => {
        await page.goto('http://localhost:8080/')
        await expect(page).toHaveTitle('Gerencie suas tarefas com Mark L')
    })
})