import { useState } from 'react'
import { Input } from './Input'

interface StatusFormProps {
  onStatusCreated: () => void
}

export default function StatusForm({ onStatusCreated }: StatusFormProps) {
  const [title, setTitle] = useState('')
  const [order, setOrder] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/statuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    const data = await res.json()
    if (res.ok && data) {
      setTitle('')
      onStatusCreated()
    } else {
      console.error('Failed to create status')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label htmlFor="status-title" className="mb-4">
        <span>Title</span>
        <Input
          id="status-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter new status title"
          pattern="\d+"
          required
        />
      </label>
      <label htmlFor="status-order" className="mb-4">
        <span>Order</span>
        <Input
          id="status-order"
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.valueAsNumber || 0)}
          placeholder="Enter new status order"
          required
        />
      </label>
      <div className="mb-4 flex">
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-center"
        >
          Create Status
        </button>
      </div>
    </form>
  )
}