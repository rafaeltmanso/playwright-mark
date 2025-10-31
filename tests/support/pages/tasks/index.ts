import { Locator, Page, expect } from '@playwright/test'
import { TaskModel } from '../../../fixtures/taskModel'

export class TasksPage {
  readonly page: Page
  readonly inputTaskName: Locator
  readonly buttonNewTask: Locator

  constructor(page: Page) {
    this.page = page
    this.inputTaskName = page.locator('input[class*="InputNewTask"]')
    this.buttonNewTask = page.locator('button[class*="ButtonNewTask"]')
  }

  // CSS modules hash the class names, so we target the stable fragment.
  private taskRow(taskName: string): Locator {
    return this.page.locator(
      `xpath=//p[text()="${taskName}"]/ancestor::*[contains(@class,"listItem_")]`
    )
  }

  async go() {
    await this.page.goto('/')
  }

  async create(task: TaskModel) {
    await this.inputTaskName.fill(task.name)
    await this.buttonNewTask.click()
  }

  async shouldHaveText(taskName: string) {
    const target = this.page.locator(`xpath=//p[text()="${taskName}"]`)
    await expect(target).toBeVisible()
  }

  async alertHaveText(text: string) {
    const target = this.page.locator('.swal2-html-container')
    await expect(target).toHaveText(text)
  }

  async getNameValidationMessage(): Promise<string> {
    return this.inputTaskName.evaluate((element) => {
      return (element as HTMLInputElement).validationMessage
    })
  }

  async toggle(taskName: string) {
    const row = this.taskRow(taskName)
    await expect(row).toBeVisible()
    await row.locator('[class*="listItemToggle"]').click()
  }

  async shouldBeDone(taskName:string) {
    const text = this.page.locator(`p:text-is("${taskName}")`)
    await expect(text).toHaveCSS('text-decoration-line', 'line-through')
  }

  async remove(taskName: string) {
    const row = this.taskRow(taskName)
    await expect(row).toBeVisible()
    await row.locator('[class*="DeleteButton"]').click()
  }

  async shouldNotExist(taskName: string) {
    const text = this.page.locator(`xpath=//p[text()="${taskName}"]`)
    await expect(text).toHaveCount(0, { timeout: 10000 })
  }
}
