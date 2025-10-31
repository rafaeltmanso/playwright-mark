import { test, expect } from '@playwright/test'
import { TaskModel } from './fixtures/taskModel'
import { deleteTaskByHelper, postTask } from './support/helpers'
import { TasksPage } from './support/pages/tasks'
import tasks from './fixtures/tasks.json'

const fixtures = tasks as Record<string, TaskModel>

test.describe('Tarefas', () => {
  let tasksPage: TasksPage

  test.beforeEach(({ page }) => {
    tasksPage = new TasksPage(page)
  })

  test.describe('Cadastro', () => {
    test(' deve poder cadastrar uma nova tarefa', async ({ request }) => {
      const task = fixtures.Success

      await deleteTaskByHelper(request, task.name)
      await tasksPage.go()
      await tasksPage.page.waitForLoadState('domcontentloaded')
      await tasksPage.create(task)
      await tasksPage.shouldHaveText(task.name)
    })

    test(' deve mostrar mensagem de erro ao tentar cadastrar tarefa duplicada', async ({
      request,
    }) => {
      const task = fixtures.Duplicate

      await deleteTaskByHelper(request, task.name)
      await postTask(request, task)

      await tasksPage.go()
      await tasksPage.page.waitForLoadState('domcontentloaded')
      await tasksPage.create(task)
      await tasksPage.alertHaveText('Task already exists!')
    })

    test(' deve validar mensagem de campo obrigatório ao cadastrar tarefa', async () => {
      const task = fixtures.Required

      await tasksPage.go()
      await tasksPage.create(task)

      const validationMessage = await tasksPage.getNameValidationMessage()
      expect(validationMessage).toBe('This is a required field')
    })
  })

  test.describe('Atualização', () => {
    test(' deve concluir uma tarefa', async ({ request }) => {
      const task = fixtures.UPDATE

      await deleteTaskByHelper(request, task.name)
      await postTask(request, task)

      await tasksPage.go()
      await tasksPage.page.waitForLoadState('domcontentloaded')
      await tasksPage.page.waitForSelector('.task-list', { state: 'visible' })
      await tasksPage.shouldHaveText(task.name)
      await tasksPage.toggle(task.name)
      await tasksPage.shouldBeDone(task.name)
    })
  })

  test.describe('Exclusão', () => {
    test(' deve excluir uma tarefa', async ({ request, page }) => {
      const task = fixtures.Delete

      await deleteTaskByHelper(request, task.name)
      await postTask(request, task)

      await tasksPage.go()

      // Wait for the task list to be populated
      await page.waitForSelector(
        `.task-list .task-item:has-text("${task.name}")`,
        {
          state: 'visible',
          timeout: 10000,
        }
      )

      await tasksPage.shouldHaveText(task.name)
      await tasksPage.remove(task.name)
      await tasksPage.shouldNotExist(task.name)
    })
  })
})
