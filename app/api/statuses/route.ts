import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
	const statuses = await prisma.status.findMany()
	return Response.json(statuses)
}

export async function POST(req: NextRequest) {
	const { title } = await req.json()
	const status = await prisma.status.create({
		data: { title },
	})
	return Response.json(status)
}