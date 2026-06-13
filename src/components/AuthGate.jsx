import React from 'react'
import { useAuth } from '../context/AuthContext'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

export default function AuthGate({ children }) {
  const { user, loading, signInWithGoogle } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🏃</div>
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            טוען...
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">🏃</div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">תכנית ריצה 2026</h1>
            <p className="text-gray-500">מרוץ 10 ק"מ — 30 באוקטובר</p>
          </div>

          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200
              rounded-2xl py-4 px-6 text-gray-700 font-semibold text-base shadow-sm
              hover:shadow-md hover:border-gray-300 active:scale-[0.98] transition-all duration-150"
          >
            <GoogleIcon />
            התחבר עם Google
          </button>

          <p className="text-center text-xs text-gray-400 mt-5">
            הנתונים שלך מאובטחים ופרטיים
          </p>
        </div>
      </div>
    )
  }

  return children
}
