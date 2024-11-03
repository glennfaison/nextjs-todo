import { PrismaClient, Status, Task, Priority } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await seedStatuses()
  await seedTasks()

  console.log('Seed data inserted successfully.')
}

async function seedStatuses() {
  const items: Partial<Status>[] = [
    { title: 'To Do' },
    { title: 'In Progress' },
    { title: 'Done' },
  ]

  for (const item of items) {
    await prisma.status.upsert({
      where: { title: item.title },
      update: {},
      create: item,
    })
  }

  console.log('Seed data for "Statuses" inserted successfully.')
}

async function seedTasks() {
  const items: Partial<Task>[] = [
    { title: 'My First Task', description: 'This is my first task', dueDate: new Date(), priority: Priority.MEDIUM, statusId: 1 },
    { title: 'My Second Task', description: 'This is my second task', dueDate: new Date(), priority: Priority.MEDIUM, statusId: 1 },
    { title: 'My Third Task', description: 'This is my third task', dueDate: new Date(), priority: Priority.MEDIUM, statusId: 1 },
  ]

  for (const item of items) {
    await prisma.task.upsert({
      where: { title: item.title },
      update: {},
      create: item,
    })
  }

  console.log('Seed data for "Tasks" inserted successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })