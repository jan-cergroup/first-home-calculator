import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CalculatorPage } from './pages/CalculatorPage'
import { GuidesIndexPage } from './pages/GuidesIndexPage'
import { StateGuidePage } from './pages/StateGuidePage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<CalculatorPage />} />
        <Route path="guides" element={<GuidesIndexPage />} />
        <Route path="guides/:stateSlug" element={<StateGuidePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
