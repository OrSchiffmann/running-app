import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { generateId } from '../utils/storage'
import AddProfileModal from './AddProfileModal'

function daysUntil(dateStr) {
  if (!dateStr) return null
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function ProfileSelector() {
  const { state, dispatch } = useApp()
  const [showAdd, setShowAdd] = useState(false)

  function select(id) {
    dispatch({ type: 'SELECT_PROFILE', id })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏃</div>
          <h1 className="text-3xl font-extrabold text-gray-900">תכנית ריצה 2026</h1>
          <p className="text-gray-500 mt-2 text-sm">בחרי פרופיל כדי להתחיל</p>
        </div>

        <p className="text-center text-gray-600 font-semibold mb-4">בחר/י פרופיל</p>

        <div className="space-y-3">
          {state.profiles.map((profile) => {
            const plan = state.plans.find((p) => p.profileId === profile.id)
            const days = plan ? daysUntil(plan.raceDate) : null
            return (
            <button
              key={profile.id}
              onClick={() => select(profile.id)}
              className="w-full flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100
                hover:border-indigo-300 hover:shadow-md active:scale-98 transition-all duration-150 text-right"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 flex-shrink-0 flex items-center justify-center">
                {profile.photo ? (
                  <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-xl font-bold">{profile.name?.[0] || '?'}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 text-lg">{profile.name}</div>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {profile.isStravaUser && (
                    <span className="text-[10px] font-bold text-white bg-orange-500 px-2 py-0.5 rounded-full">
                      STRAVA
                    </span>
                  )}
                  {plan && days !== null && days > 0 && (
                    <span className="text-xs text-indigo-600 font-semibold">
                      🏁 {plan.raceLabel} — עוד {days} ימים
                    </span>
                  )}
                  {plan && days !== null && days <= 0 && (
                    <span className="text-xs text-green-600 font-semibold">🏅 יום המרוץ הגיע!</span>
                  )}
                  {!plan && (
                    <span className="text-xs text-gray-400">אין תוכנית</span>
                  )}
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )})}

          <button
            onClick={() => setShowAdd(true)}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200
              rounded-2xl p-4 text-gray-500 hover:border-indigo-300 hover:text-indigo-600
              hover:bg-indigo-50 transition-all duration-150"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-semibold">הוסף פרופיל</span>
          </button>
        </div>
      </div>

      {showAdd && <AddProfileModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}
