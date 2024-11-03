import { useState } from 'react'
import { Priority, Status, Task } from '@prisma/client'
import { Input } from './Input'

interface TaskFormProps {
  onTaskCreated: () => void
  statuses: Status[]
  selectedTask: Task | null
}

export default function TaskForm({ onTaskCreated, statuses, selectedTask }: TaskFormProps) {
  const [title, setTitle] = useState(selectedTask?.title || '')
  const [description, setDescription] = useState(selectedTask?.description || '')
  const now = new Date()
  const formattedNow = now.toISOString().split('T')[0]
  const formattedDueDate = selectedTask?.dueDate ? new Date(selectedTask.dueDate).toISOString().split('T')[0] : formattedNow
  const [dueDate, setDueDate] = useState(formattedDueDate)
  const [priority, setPriority] = useState<string>(selectedTask?.priority || Priority.MEDIUM)
  const [statusId, setStatusId] = useState(selectedTask?.statusId || '')

  const handleSubmit = async (e: React.FormEvent) => {
    console.log({ title, description, dueDate, priority, statusId })
    e.preventDefault()
    const requestUrl = selectedTask ? '/api/tasks/' + selectedTask.id : '/api/tasks'
    const requestMethod = selectedTask ? 'PUT' : 'POST'
    const res = await fetch(requestUrl, {
      method: requestMethod,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, dueDate, priority, statusId }),
    })
    const data = await res.json()

    if (res.ok && data) {
      setTitle('')
      setDescription('')
      setDueDate('')
      setPriority(Priority.MEDIUM)
      setStatusId('')
      onTaskCreated()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white py-6 text-black">
      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-4">
        <span>Title</span>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-4">
        <span>Description</span>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
        />
      </label>
      <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-4">
        <span>Due Date</span>
        <Input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </label>
      <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-4">
        <span>Priority</span>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </label>
      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-4">
        <span>Status</span>
        <select
          id="status"
          value={statusId}
          onChange={(e) => setStatusId(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select a status</option>
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.title}
            </option>
          ))}
        </select>
      </label>
      <div className="mb-4 flex">
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-center"
        >
          {selectedTask ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  )
}