import { PrismaClient, Task } from '@prisma/client'
import { NextRequest } from 'next/server';

const prisma = new PrismaClient()

export async function GET() {
	const tasks = await prisma.task.findMany({
		include: { status: true },
	})
	return Response.json(tasks)
}

export async function POST(req: NextRequest) {
	const { title, description, dueDate, priority, statusId } = await req.json()
	const itemToSave: Partial<Task> = {
		title,
		description,
		dueDate: new Date(dueDate),
		priority,
		statusId: Number(statusId),
	}
	const task = await prisma.task.create({
		data: itemToSave,
	})
	return Response.json(task)
}