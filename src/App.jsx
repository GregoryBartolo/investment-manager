import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useInvestmentStore from './stores/investmentStore'
import AppLayout from './components/layout/AppLayout'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/Accounts'
import Update from './pages/Update'

function App() {
  const { fetchAll, fetchConfig, config, loading } = useInvestmentStore()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    async function init() {
      await fetchConfig()
      await fetchAll()
      setInitialized(true)
    }
    init()
  }, [fetchAll, fetchConfig])

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  const onboardingComplete = config.onboardingComplete === 'true'

  if (!onboardingComplete) {
    return <Onboarding />
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/comptes" element={<Accounts />} />
        <Route path="/mise-a-jour" element={<Update />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default App
