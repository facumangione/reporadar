import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import ComparePage from './pages/ComparePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
