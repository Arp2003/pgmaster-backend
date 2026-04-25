import React from 'react'
import { render, screen } from '@testing-library/react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import '@testing-library/jest-dom'

// Wrapper component to provide necessary providers
const QueryWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('Modal Component', () => {
  it('should render modal when isOpen is true', () => {
    const { Modal } = require('@/components/shared/Modal')
    
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
      { wrapper: QueryWrapper }
    )

    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('should not render modal when isOpen is false', () => {
    const { Modal } = require('@/components/shared/Modal')
    
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
      { wrapper: QueryWrapper }
    )

    expect(container.firstChild).toBeNull()
  })
})

describe('RoomForm Component', () => {
  it('should render all form fields', () => {
    const { RoomForm } = require('@/components/dashboard/RoomForm')
    
    render(
      <RoomForm onSubmit={() => Promise.resolve()} />,
      { wrapper: QueryWrapper }
    )

    expect(screen.getByPlaceholderText('e.g., 101')).toBeInTheDocument()
    expect(screen.getByDisplayValue('AC')).toBeInTheDocument()
  })

  it('should display validation errors', async () => {
    const { RoomForm } = require('@/components/dashboard/RoomForm')
    
    render(
      <RoomForm onSubmit={() => Promise.resolve()} />,
      { wrapper: QueryWrapper }
    )

    const submitButton = screen.getByText('Save Room')
    submitButton.click()

    // Wait for validation messages
    await new Promise(resolve => setTimeout(resolve, 100))
  })
})

describe('TenantForm Component', () => {
  it('should render all tenant form fields', () => {
    const { TenantForm } = require('@/components/dashboard/TenantForm')
    
    render(
      <TenantForm onSubmit={() => Promise.resolve()} beds={[]} />,
      { wrapper: QueryWrapper }
    )

    expect(screen.getByPlaceholderText('Full name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('10-digit number')).toBeInTheDocument()
  })
})
