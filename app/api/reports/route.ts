import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
	const tasksByStatus = await prisma.status.findMany({
		include: {
			_count: {
				select: { tasks: true },
			},
		},
	})

	const tasksByPriority = await prisma.task.groupBy({
		by: ['priority'],
		_count: {
			_all: true,
		},
	})

	const overdueTasks = await prisma.task.count({
		where: {
			dueDate: {
				lt: new Date(),
			},
			status: {
				title: { not: 'Done' },
			},
		},
	})

	return Response.json({
		tasksByStatus,
		tasksByPriority,
		overdueTasks,
	})
}