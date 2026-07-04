import React, { useState, useRef, useEffect } from 'react'
import { useCurrentProfile, useApp } from '../context/AppContext'
import AddProfileModal from './AddProfileModal'

const tabs = [
  {
    id: 'dashboard',
    label: 'בית',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'plan',
    label: 'תכנית',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'freeruns',
    label: 'ריצות חופשיות',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'progress',
    label: 'התקדמות',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'strength',
    label: 'חיזוק',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
]

function Avatar({ profile, size = 8 }) {
  return (
    <div className={`w-${size} h-${size} rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0`}>
      {profile?.photo ? (
        <img src={profile.photo} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className="text-white font-bold" style={{ fontSize: size * 2 }}>{profile?.name?.[0] || '?'}</span>
      )}
    </div>
  )
}

function ProfileMenu({ onSignOut, onClose }) {
  const { state, dispatch } = useApp()
  const profile = useCurrentProfile()
  const [editingProfile, setEditingProfile] = useState(null)

  function switchProfile(id) {
    dispatch({ type: 'SELECT_PROFILE', id })
    onClose()
  }

  function switchToSelector() {
    dispatch({ type: 'LOGOUT' })
    onClose()
  }

  function handleSignOut() {
    dispatch({ type: 'LOGOUT' })
    onSignOut?.()
    onClose()
  }

  const others = state.profiles.filter((p) => p.id !== profile?.id)

  if (editingProfile) {
    return (
      <AddProfileModal
        existing={editingProfile}
        onClose={() => {
          setEditingProfile(null)
          onClose()
        }}
      />
    )
  }

  return (
    <div className="absolute top-12 left-0 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
      {/* Current profile */}
      <div className="px-4 py-2 flex items-center gap-3 border-b border-gray-100 mb-1">
        <Avatar profile={profile} size={8} />
        <div className="min-w-0 flex-1">
          <div className="font-bold text-sm text-gray-900 truncate">{profile?.name}</div>
          <div className="text-xs text-indigo-500">פרופיל נוכחי</div>
        </div>
        <button
          onClick={() => setEditingProfile(profile)}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
          title="ערוך פרופיל"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>

      {/* Other profiles */}
      {others.length > 0 && (
        <>
          <div className="px-4 pt-1 pb-0.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">החלף פרופיל</div>
          {others.map((p) => (
            <div key={p.id} className="flex items-center gap-1 px-2">
              <button
                onClick={() => switchProfile(p.id)}
                className="flex-1 flex items-center gap-3 px-2 py-2.5 hover:bg-indigo-50 rounded-xl transition-colors text-right"
              >
                <Avatar profile={p} size={7} />
                <span className="font-medium text-sm text-gray-800">{p.name}</span>
              </button>
              <button
                onClick={() => setEditingProfile(p)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 transition-colors flex-shrink-0"
                title="ערוך פרופיל"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          ))}
        </>
      )}

      {/* All profiles screen */}
      <button
        onClick={switchToSelector}
        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-right"
      >
        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <span className="text-sm text-gray-600">כל הפרופילים</span>
      </button>

      <div className="border-t border-gray-100 mt-1 pt-1">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-right"
        >
          <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <span className="text-sm text-red-500">התנתק מגוגל</span>
        </button>
      </div>
    </div>
  )
}

export default function Navbar({ activeTab, setActiveTab, onSignOut }) {
  const profile = useCurrentProfile()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef()

  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e) {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 inset-x-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-14 max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏃</span>
            <span className="font-extrabold text-gray-900 text-base">תכנית ריצה 2026</span>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-semibold text-gray-700 hidden sm:block">{profile?.name}</span>
              <Avatar profile={profile} size={8} />
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <ProfileMenu onSignOut={onSignOut} onClose={() => setMenuOpen(false)} />
            )}
          </div>
        </div>
      </header>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-100 safe-area-bottom">
        <div className="flex max-w-2xl mx-auto">
          {tabs.map((tab) => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors
                  ${active ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {tab.icon}
                <span className="text-[10px] font-semibold">{tab.label}</span>
                {active && <div className="absolute bottom-0 w-8 h-0.5 bg-indigo-600 rounded-full" />}
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
