import { RouterProvider } from 'react-router'
import { router } from '@/app/router'
import { DemoStateProvider } from '@/state/DemoStateProvider'

export function App() {
  return (
    <DemoStateProvider>
      <RouterProvider router={router} />
    </DemoStateProvider>
  )
}
