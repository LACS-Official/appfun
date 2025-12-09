import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
vi.mock('../components/auth/AuthButton.jsx', () => ({ default: () => <div /> }))
import Header from '../components/react/Header'

describe('Header', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    localStorage.clear()
  })

  it('渲染标题与导航', () => {
    render(<Header title="APPFUN" showSearch />)
    expect(screen.getByText('APPFUN')).toBeInTheDocument()
    expect(screen.getByText('首页')).toBeInTheDocument()
    expect(screen.getByText('分类')).toBeInTheDocument()
    expect(screen.getByText('标签')).toBeInTheDocument()
    expect(screen.getByText('关于')).toBeInTheDocument()
  })

  it('支持暗黑模式切换', () => {
    render(<Header title="APPFUN" showSearch />)
    const toggle = screen.getByRole('switch', { name: '切换深色模式' })
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    fireEvent.click(toggle)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    fireEvent.click(toggle)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
