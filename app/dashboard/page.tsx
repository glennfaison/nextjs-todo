'use client'

import { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function Dashboard() {
  const [reportData, setReportData] = useState(null)

  useEffect(() => {
    fetchReportData()
  }, [])

  const fetchReportData = async () => {
    const res = await fetch('/api/reports')
    const data = await res.json()
    setReportData(data)
  }

  if (!reportData) return <div>Loading...</div>

  const tasksByStatusData = {
    labels: reportData.tasksByStatus.map((status) => status.title),
    datasets: [
      {
        label: 'Tasks by Status',
        data: reportData.tasksByStatus.map((status) => status._count.tasks),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  }

  const tasksByPriorityData = {
    labels: reportData.tasksByPriority.map((priority) => priority.priority),
    datasets: [
      {
        label: 'Tasks by Priority',
        data: reportData.tasksByPriority.map((priority) => priority._count._all),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Tasks by Status</h2>
          <Bar data={tasksByStatusData} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Tasks by Priority</h2>
          <Bar data={tasksByPriorityData} />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Overdue Tasks</h2>
        <p className="text-4xl font-bold text-red-600">{reportData.overdueTasks}</p>
      </div>
    </div>
  )
}