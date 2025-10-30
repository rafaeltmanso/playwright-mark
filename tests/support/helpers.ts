import { expect, APIRequestContext } from '@playwright/test'
import { TaskModel } from '../fixtures/taskModel'

export async function deleteTaskByHelper(
  request: APIRequestContext,
  taskName: string
) {
  await request.delete(`http://localhost:3333/helper/tasks/${taskName}`)
}

export async function postTask(request: APIRequestContext, task: TaskModel) {
  await request.post('http://localhost:3333/tasks', { data: task })
}
