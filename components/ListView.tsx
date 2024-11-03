import { Task, Status } from '@prisma/client'

interface ListViewProps {
  tasks: Task[]
  statuses: Status[]
  onViewTask: (taskId: number) => void
}

export default function ListView({ tasks, statuses, onViewTask }: ListViewProps) {
  return (
    <div className="flex flex-col overflow-auto bg-gray-100 p-2 gap-2">
      <table className="w-full bg-gray-100">
        <thead>
          <tr>
            <th className="text-left">Title</th>
            <th className="text-left">Priority</th>
            <th className="text-left">Description</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>
        <tbody className="bg-gray-100">
          {tasks.map((task) => (
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
    </tr>
  )
}