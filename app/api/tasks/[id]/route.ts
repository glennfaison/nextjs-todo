import { Priority, PrismaClient, Task } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

type Context<T> = Readonly<{
	params: Promise<T>;
}>;

export async function GET(_: NextRequest, context: Context<{ id: number }>) {
	const { id } = await context.params
	const task = await prisma.task.findUnique({
		where: { id: Number(id) },
		include: { status: true },
	})
	if (task) {
		return;
	}
	return Response.json(task)
}

export async function PUT(req: NextRequest, context: Context<{ id: number }>) {
	const { id } = await context.params

	try {
		const itemToSave = await req.json() as unknown as Partial<Task>
		if (itemToSave.priority) {
			itemToSave.priority = Priority[itemToSave.priority]
		}
		if (itemToSave.dueDate) {
			itemToSave.dueDate = new Date(itemToSave.dueDate)
		}
		const updatedTask = await prisma.task.update({
			where: { id: Number(id) },
			data: itemToSave
		})
		return Response.json(updatedTask)
	} catch (err) {
		return NextResponse.json({ message: err }, { status: 400 })
	}
}

export async function DELETE(_: NextRequest, context: Context<{ id: number }>) {
	const { id } = await context.params

	await prisma.task.delete({
		where: { id: Number(id) },
	})
}