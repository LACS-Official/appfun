import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs.jsx'

describe('Tabs 组件', () => {
  it('默认显示第一个面板', async () => {
    render(
      <Tabs defaultIndex={0}>
        <TabsList>
          <TabsTrigger>标签一</TabsTrigger>
          <TabsTrigger>标签二</TabsTrigger>
        </TabsList>
        <div>
          <TabsContent>
            面板一内容
          </TabsContent>
          <TabsContent>
            面板二内容
          </TabsContent>
        </div>
      </Tabs>
    )

    expect(screen.getByText('面板一内容')).toBeInTheDocument()
    expect(screen.queryByText('面板二内容')).toBeNull()
  })

  it('切换到第二个面板', async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultIndex={0}>
        <TabsList>
          <TabsTrigger>标签一</TabsTrigger>
          <TabsTrigger>标签二</TabsTrigger>
        </TabsList>
        <div>
          <TabsContent>
            面板一内容
          </TabsContent>
          <TabsContent>
            面板二内容
          </TabsContent>
        </div>
      </Tabs>
    )

    await user.click(screen.getByRole('tab', { name: '标签二' }))
    expect(screen.getByText('面板二内容')).toBeInTheDocument()
    expect(screen.queryByText('面板一内容')).toBeNull()
  })
})
