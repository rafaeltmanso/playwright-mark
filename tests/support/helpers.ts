import { APIRequestContext } from '@playwright/test'
import { TaskModel } from '../fixtures/taskModel'

require('dotenv').config()
const BASE_API = process.env.BASE_API ?? 'http://localhost:3333'

export async function deleteAllTasks(request: APIRequestContext) {
  await request.delete(`${BASE_API}/helper/tasks`)
}

export async function deleteTaskByHelper(
  request: APIRequestContext,
  taskName: string
) {
  await request.delete(`${BASE_API}/helper/tasks/${taskName}`)
}

export async function postTask(request: APIRequestContext, task: TaskModel) {
  await request.post(`${BASE_API}/tasks`, { data: task })
}
