'use client'

import React, { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'

interface FilterOptions {
  search: string
  status?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  dateFrom?: string
  dateTo?: string
}

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void
  statuses?: Array<{ value: string; label: string }>
  sortOptions?: Array<{ value: string; label: string }>
  showDateRange?: boolean
  placeholder?: string
}

export default function FilterBar({
  onFilterChange,
  statuses,
  sortOptions,
  showDateRange = false,
  placeholder = 'Search...',
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: '',
    sortBy: '',
    sortOrder: 'asc',
    dateFrom: '',
    dateTo: '',
  })

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, search: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleStatusChange = (value: string) => {
    const newFilters = { ...filters, status: value || undefined }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleSortChange = (value: string) => {
    const newFilters = { ...filters, sortBy: value || undefined }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleSortOrderChange = (value: 'asc' | 'desc') => {
    const newFilters = { ...filters, sortOrder: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleDateChange = (type: 'from' | 'to', value: string) => {
    const newFilters = {
      ...filters,
      [type === 'from' ? 'dateFrom' : 'dateTo']: value || undefined,
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    const emptyFilters: FilterOptions = {
      search: '',
      status: '',
      sortBy: '',
      sortOrder: 'asc',
      dateFrom: '',
      dateTo: '',
    }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
    setIsOpen(false)
  }

  const hasActiveFilters =
    filters.search ||
    filters.status ||
    filters.sortBy ||
    filters.dateFrom ||
    filters.dateTo

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Filter Toggle and Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
            isOpen
              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500'
          } ${hasActiveFilters ? 'ring-1 ring-indigo-500' : ''}`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
              {Object.values(filters).filter((v) => v).length}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-2 text-sm text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {isOpen && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Status Filter */}
            {statuses && statuses.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">All Status</option>
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort By */}
            {sortOptions && sortOptions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Sort By
                </label>
                <div className="flex gap-2">
                  <select
                    value={filters.sortBy || ''}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Default</option>
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) =>
                      handleSortOrderChange(e.target.value as 'asc' | 'desc')
                    }
                    className="w-24 px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Date Range */}
          {showDateRange && (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleDateChange('from', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleDateChange('to', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
