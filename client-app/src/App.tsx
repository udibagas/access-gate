import { RouterProvider } from 'react-router'
import { Suspense } from 'react'
import Loading from './components/Loading'
import { router } from './router'

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}