import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import SidebarTabs from '../components/react/SidebarTabs'

describe('SidebarTabs', () => {
  beforeEach(() => {
    ;(window as any).apiClient = {
      getSoftwareRanking: async () => ({
        success: true,
        data: [
          { id: '1', name: '软件一', viewCount: 1234 },
          { id: '2', name: '软件二', viewCount: 2345 },
        ],
      }),
      getSoftwareList: async () => ({
        success: true,
        data: {
          items: [
            { id: '3', name: '软件三', description: '描述A', updatedAt: new Date().toISOString() },
            { id: '4', name: '软件四', description: '描述B', updatedAt: new Date().toISOString() },
          ],
        },
      }),
    }
  })

  it('加载并展示热门与最新列表', async () => {
    render(<SidebarTabs />)

    await waitFor(() => {
      expect(screen.getByText('软件一')).toBeInTheDocument()
      expect(screen.getByText('软件二')).toBeInTheDocument()
    })

    const latestTab = screen.getByRole('tab', { name: /最新收录/ })
    latestTab.click()

    await waitFor(() => {
      expect(screen.getByText('软件三')).toBeInTheDocument()
      expect(screen.getByText('软件四')).toBeInTheDocument()
    })
  })
})
