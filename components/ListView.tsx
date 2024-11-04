import { Task, Status, Priority } from '@prisma/client'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'

interface ListViewProps {
  tasks: Task[]
  statuses: Status[]
  onViewTask: (taskId: number) => void
}

export default function ListView({ tasks, statuses, onViewTask }: ListViewProps) {
  const [sort, setSort] = useState({ priority: 'asc', dueDate: 'asc' })
  const [tasksToDisplay, setTasksToDisplay] = useState(tasks || [])

  useEffect(() => {
    const priorityOrder = {
      [Priority.LOW]: 1,
      [Priority.MEDIUM]: 2,
      [Priority.HIGH]: 3,
    }
    if (sort?.priority && ['asc', 'desc'].includes(sort.priority)) {
      const sortedTasks = tasksToDisplay.sort((a, b) => {
        const aPriority = priorityOrder[a.priority]
        const bPriority = priorityOrder[b.priority]
        return sort.priority === 'asc' ? aPriority - bPriority : bPriority - aPriority
      })
      setTasksToDisplay(sortedTasks)
    }
  }, [sort?.priority, tasksToDisplay])

  useEffect(() => {
    if (sort?.dueDate && ['asc', 'desc'].includes(sort.dueDate)) {
      const sortedTasks = tasksToDisplay.sort((a, b) => {
        const aDueDate = new Date(a.dueDate).getTime()
        const bDueDate = new Date(b.dueDate).getTime()
        return sort.dueDate === 'asc' ? aDueDate - bDueDate : bDueDate - aDueDate
      })
      setTasksToDisplay(sortedTasks)
    }
  }, [sort?.dueDate, tasksToDisplay])

  return (
    <div className="flex flex-col overflow-auto bg-gray-100 p-2 gap-2">
      <table className="w-full bg-gray-100">
        <thead>
          <tr>
            <th className="text-left">
              <span className="cursor-pointer">Title</span>
            </th>
            <th className="text-left" onClick={() => setSort({ ...sort, priority: sort.priority === 'asc' ? 'desc' : 'asc' })}>
              <CaretSortIcon className="inline cursor-pointer" />
              <span className="cursor-pointer">Priority</span>
            </th>
            <th className="text-left">
              <span className="cursor-pointer">Description</span>
            </th>
            <th className="text-left">
              <span className="cursor-pointer">Status</span>
            </th>
            <th className="text-left" onClick={() => setSort({ ...sort, dueDate: sort.dueDate === 'asc' ? 'desc' : 'asc' })}>
              <CaretSortIcon className="inline cursor-pointer" />
              <span className="cursor-pointer">Due Date</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-100">
          {tasksToDisplay.map((task) => (
            <ListViewItem
              key={task.id}
              task={task}
              onViewTask={onViewTask}
              status={statuses.find((status) => status.id === task.statusId)}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface ListViewItemProps {
  task: Task
  onViewTask: (taskId: number) => void
  status: Status | undefined
}

function ListViewItem({ task, onViewTask, status }: ListViewItemProps) {
  return (
    <tr className="p-4 rounded-lg my-2 cursor-pointer" onClick={() => onViewTask(task.id)}>
      <td className="text-left p-2 bg-white font-extrabold">{task.title}</td>
      <td className="text-left p-2 bg-white text-xs">{task.priority}</td>
      <td className="text-left p-2 bg-white font-extralight overflow-ellipsis">{task.description}</td>
      <td className="text-left p-2 bg-white font-extralight uppercase text-xs">{status?.title}</td>
      <td className="text-left p-2 bg-white font-extralight uppercase text-xs">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</td>
    </tr>
  )
}