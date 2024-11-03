'use client'

import { useState, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import KanbanBoard from '@/components/KanbanBoard'
import TaskForm from '@/components/TaskForm'
import StatusForm from '@/components/StatusForm'
import { Task, Status } from '@prisma/client'
import Taskbar from '@/components/Taskbar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Dialog'

export default function Home() {
  const [statuses, setStatuses] = useState<Status[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [taskFilter, setTaskFilter] = useState<string>('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks')
    const data = await res.json()
    setTasks(data)
  }

  const fetchStatuses = async () => {
    const res = await fetch('/api/statuses')
    const data = await res.json()
    setStatuses(data)
  }

  const handleTaskMove = async (taskId: string, newStatusId: string) => {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statusId: newStatusId }),
    })
    const data = await res.json()
    if (res.ok && data) {
      fetchTasks()
    }
  }

  const handleTaskCreated = () => {
    fetchTasks()
    setSelectedTask(null)
    setIsTaskModalOpen(false)
  }

  const handleStatusCreated = () => {
    fetchStatuses()
    setIsStatusModalOpen(false)
  }

  const handleFilterChange = (search: string, status: string) => {
    setTaskFilter(search)
    setStatusFilter(status)
  }

  const handleViewTask = (taskId: number) => {
    const task = tasks.find((task) => task.id === taskId)
    setSelectedTask(task || null)
    setIsTaskModalOpen(true)
    // router.push(`/tasks/${taskId}`)
  }

  useEffect(() => {
    fetchStatuses()
    fetchTasks()
  }, [])

  useEffect(() => {
    let filtered = tasks || []
    if (taskFilter) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(taskFilter.toLowerCase()) ||
          task.description.toLowerCase().includes(taskFilter.toLowerCase())
      )
    }
    if (statusFilter) {
      filtered = filtered.filter((task) => task.statusId.toString() === statusFilter)
    }
    setFilteredTasks(filtered)
  }, [statusFilter, taskFilter, tasks])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Task Management</h1>
      <Taskbar
        onOpenTaskModal={() => setIsTaskModalOpen(true)}
        onOpenStatusModal={() => setIsStatusModalOpen(true)}
        onFilterChange={handleFilterChange}
        statuses={statuses}
      />
      <br />

      <DndProvider backend={HTML5Backend}>
        <KanbanBoard tasks={filteredTasks} statuses={statuses} onMoveTask={handleTaskMove} onViewTask={handleViewTask} />
      </DndProvider>

      <template>
        <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
          <DialogContent className="bg-transparent">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TaskForm onTaskCreated={handleTaskCreated} statuses={statuses} selectedTask={selectedTask} />
          </DialogContent>
        </Dialog>

        <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
          <DialogContent className="bg-transparent">
            <DialogHeader>
              <DialogTitle>
                {selectedTask ? 'Update Task' : 'Create New Status'}
              </DialogTitle>
            </DialogHeader>
            <StatusForm onStatusCreated={handleStatusCreated} />
          </DialogContent>
        </Dialog>
      </template>
    </div>
  )
}