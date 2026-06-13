import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider, useApp, useCurrentProfile } from './context/AppContext'
import AuthGate from './components/AuthGate'
import ProfileSelector from './components/ProfileSelector'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import TrainingPlan from './components/TrainingPlan'
import FreeRuns from './components/FreeRuns'
import Progress from './components/Progress'

function SyncErrorBanner() {
  const { syncError } = useApp()
  if (!syncError) return null
  return (
    <div className="fixed top-14 inset-x-0 z-40 bg-red-500 text-white text-center text-sm py-2 px-4 font-medium">
      {syncError}
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <div className="text-center">
        <div className="text-5xl mb-4">🏃</div>
        <div className="flex items-center gap-2 text-gray-500">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          טוען נתונים...
        </div>
      </div>
    </div>
  )
}

function AppShell() {
  const { dataLoading } = useApp()
  const { signOut } = useAuth()
  const profile = useCurrentProfile()
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('code') && params.get('state') === 'strava_auth') {
      setActiveTab('dashboard')
    }
  }, [])

  if (dataLoading) return <LoadingScreen />

  if (!profile) return <ProfileSelector />

  return (
    <div className="min-h-screen bg-gray-50">
      <SyncErrorBanner />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onSignOut={signOut} />
      <main className="pt-14 pb-20 max-w-2xl mx-auto px-4">
        <div className="py-4">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'plan'      && <TrainingPlan />}
          {activeTab === 'freeruns'  && <FreeRuns />}
          {activeTab === 'progress'  && <Progress />}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <AppProvider>
          <AppShell />
        </AppProvider>
      </AuthGate>
    </AuthProvider>
  )
}
