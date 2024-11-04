import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Status } from '@prisma/client'
import * as Select from '@radix-ui/react-select'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, ListBulletIcon, BarChartIcon } from '@radix-ui/react-icons'

import './dropdown-menu.css'
import './select.css'
import './toggle-group.css'

interface TaskbarProps {
	onOpenTaskModal: () => void
	onOpenStatusModal: () => void
	onFilterChange: (search: string, status: string) => void
	onViewChange: (view: string) => void
	statuses: Status[]
	view: string
}

export default function Taskbar({ onOpenTaskModal, onOpenStatusModal, onFilterChange, onViewChange, statuses, view }: TaskbarProps) {
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onFilterChange(e.target.value, selectedStatus)
  }

  const handleStatusChange = (statusId: string) => {
    if (statusId === 'none') {
      statusId = ''
    }
    setSelectedStatus(statusId)
    onFilterChange(search, statusId)
  }

  const handleViewChange = (value: string) => {
    if (!value) return
    onViewChange(value)
  }

  return (
    <div className="bg-gray-100 border-b p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={handleSearchChange}
              className="pl-8 pr-4 py-2 w-64"
            />
          </div>

          <span className="border border-gray-300 rounded-md">
            <ToggleGroup.Root
              className="ToggleGroup"
              type="single"
              defaultValue={view}
              aria-label="Select View"
              onValueChange={handleViewChange}
            >
              <ToggleGroup.Item
                className="ToggleGroupItem"
                value="kanban"
                aria-label="Kanban Board"
                title="Kanban Board"
              >
                <BarChartIcon className="rotate-180" />
              </ToggleGroup.Item>
              <ToggleGroup.Item
                className="ToggleGroupItem"
                value="list"
                aria-label="List View"
                title="List View"
              >
                <ListBulletIcon />
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </span>

          <div>
            <Select.Root onValueChange={handleStatusChange}>
              <Select.Trigger className="SelectTrigger" aria-label="Filter tasks by status">
                <Select.Value placeholder="Filter by Status" className="cursor-pointer" />
                <Select.Icon className="SelectIcon">
                  <ChevronDownIcon />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="SelectContent">
                  <Select.ScrollUpButton className="SelectScrollButton">
                    <ChevronUpIcon />
                  </Select.ScrollUpButton>
                  <Select.Viewport className="SelectViewport">
                    <Select.Group>
                      <Select.Label className="SelectLabel">Filter by Status</Select.Label>
                      <Select.Item className="SelectItem" value={'none'}>
                        <Select.ItemText>None</Select.ItemText>
                        <Select.ItemIndicator className="SelectItemIndicator">
                          <CheckIcon />
                        </Select.ItemIndicator>
                      </Select.Item>
                      {statuses.map((status) => (
                        <Select.Item className="SelectItem" key={status.id} value={status.id.toString()}>
                          <Select.ItemText>{status.title}</Select.ItemText>
                          <Select.ItemIndicator className="SelectItemIndicator">
                            <CheckIcon />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Select.Viewport>
                  <Select.ScrollDownButton className="SelectScrollButton">
                    <ChevronDownIcon />
                  </Select.ScrollDownButton>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-2 bg-gray-100 hover:bg-gray-300 rounded-lg cursor-pointer border border-gray-300">
              <Plus className="mr-2 h-4 w-4 inline" /> Add
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
              <DropdownMenu.Item className="DropdownMenuItem" onClick={onOpenTaskModal}>
                New Task
              </DropdownMenu.Item>
              <DropdownMenu.Item className="DropdownMenuItem" onClick={onOpenStatusModal}>
                New Status
              </DropdownMenu.Item>

              <DropdownMenu.Arrow className="DropdownMenuArrow" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  )
}