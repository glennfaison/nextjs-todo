import { useDrop } from 'react-dnd'
import TaskCard from './TaskCard'
import { Task, Status } from '@prisma/client'

interface KanbanBoardProps {
  tasks: Task[]
  statuses: Status[]
  onMoveTask: (taskId: string, newStatusId: string) => void
  onViewTask: (taskId: number) => void
}

export default function KanbanBoard({ tasks, statuses, onMoveTask, onViewTask }: KanbanBoardProps) {
  return (
    <div className="flex space-x-4 overflow-x-auto">
      {statuses.map((status) => (
        <Column
          key={status.id}
          status={status}
          tasks={tasks.filter((task) => task.statusId === status.id)}
          onMoveTask={onMoveTask}
          onViewTask={onViewTask}
        />
      ))}
    </div>
  )
}

interface ColumnProps {
  status: Status
  tasks: Task[]
  onMoveTask: (taskId: string, newStatusId: string) => void
  onViewTask: (taskId: number) => void
}

function Column({ status, tasks, onMoveTask, onViewTask }: ColumnProps) {
  const [, drop] = useDrop({
    accept: 'task',
    drop: (item: { id: string }) => {
      onMoveTask(item.id, status.id.toString())
    },
  })

  return (
    <div ref={drop} className="bg-gray-100 p-4 rounded-lg min-w-[250px]">
      <h2 className="font-bold mb-4">{status.title}</h2>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onViewTask={onViewTask} />
      ))}
    </div>
  )
}