import { useDrag } from 'react-dnd'
import { Task } from '@prisma/client'

interface TaskCardProps {
  task: Task
  onViewTask: (taskId: number) => void
}

export default function TaskCard({ task, onViewTask }: TaskCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  return (
    <div
      ref={drag}
      className={`bg-white p-4 mb-2 rounded shadow ${
        isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab'
      }`}
      onClick={() => onViewTask(task.id)}
    >
      <h3 className="font-bold">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.description}</p>
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        <span>Priority: {task.priority}</span>
      </div>
    </div>
  )
}