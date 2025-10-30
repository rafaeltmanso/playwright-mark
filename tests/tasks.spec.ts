import { test, expect } from '@playwright/test'
import { TaskModel } from './fixtures/taskModel'
import { deleteTaskByHelper, postTask } from './support/helpers'
import { TasksPage } from './support/pages/tasks'

let tasksPage: TasksPage

test.beforeEach(({ page }) => {
  tasksPage = new TasksPage(page)
})

test(' deve poder cadastrar uma nova tarefa', async ({ page, request }) => {
  const task: TaskModel = {
    name: 'Ler um livro de TypeScript',
    is_done: false,
  }

  await deleteTaskByHelper(request, task.name)
  await tasksPage.go()
  await tasksPage.create(task)
  await tasksPage.shouldHaveText(task.name)
})

test(' deve mostrar mensagem de erro ao tentar cadastrar tarefa duplicada', async ({
  page,
  request,
}) => {
  const task: TaskModel = {
    name: 'Estudar Playwright',
    is_done: false,
  }

  await deleteTaskByHelper(request, task.name)
  await postTask(request, task)

  await tasksPage.go()
  await tasksPage.create(task)
  await tasksPage.alertHaveText('Task already exists!')
})
