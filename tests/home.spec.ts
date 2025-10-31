import { test, expect } from '@playwright/test'

test.describe('webapp deve estar online', () => {
  test('home page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle('Gerencie suas tarefas com Mark L')
  })
})
