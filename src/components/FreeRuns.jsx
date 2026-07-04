import React, { useState } from 'react'
import { useApp, useCurrentProfile } from '../context/AppContext'
import FreeRunModal from './FreeRunModal'
import AssignToWorkoutModal from './AssignToWorkoutModal'
import { formatDuration, toHours } from '../utils/format'

function RunCard({ run, profiles, onClick, onAssign }) {
  const profile = profiles.find((p) => p.id === run.profileId)
  const date = new Date(run.date).toLocaleDateString('he-IL', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div
      className="card hover:border-indigo-200 hover:shadow-md cursor-pointer transition-all active:scale-[0.99]"
      onClick={() => onClick(run)}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center flex-shrink-0 text-white text-lg">
          🏃
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-gray-900 truncate">{run.title || 'ריצה חופשית'}</h3>
            <span className="text-xs text-gray-400 flex-shrink-0">{date}</span>
          </div>
          {profile && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-4 h-4 rounded-full overflow-hidden bg-indigo-400 flex items-center justify-center flex-shrink-0">
                {profile.photo
                  ? <img src={profile.photo} alt="" className="w-full h-full object-cover" />
                  : <span className="text-white text-[8px] font-bold">{profile.name?.[0]}</span>
                }
              </div>
              <span className="text-xs text-gray-500">{profile.name}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-3 mt-2 text-sm">
            <span className="flex items-center gap-1 font-semibold text-gray-700">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDuration(run.duration)}
            </span>
            {run.distance && (
              <span className="flex items-center gap-1 text-gray-600">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {run.distance} ק"מ
              </span>
            )}
            {run.pace && (
              <span className="text-gray-500">{run.pace} דק׳/ק"מ</span>
            )}
            {run.avgHeartRate && (
              <span className="text-gray-500">♥ {run.avgHeartRate} bpm</span>
            )}
            {run.kneeFeeling && (
              <span className={`font-medium
                ${run.kneeFeeling >= 7 ? 'text-red-500' : run.kneeFeeling >= 4 ? 'text-yellow-600' : 'text-green-600'}`}>
                ברך: {run.kneeFeeling}/10
              </span>
            )}
          </div>
          {run.notes && (
            <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{run.notes}</p>
          )}
          {run.photos?.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {run.photos.slice(0, 4).map((p, i) => (
                <img key={i} src={p} alt="" className="w-12 h-12 rounded-lg object-cover" />
              ))}
              {run.photos.length > 4 && (
                <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-500 font-bold">
                  +{run.photos.length - 4}
                </div>
              )}
            </div>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onAssign(run) }}
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            שייך לאימון בתכנית
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FreeRuns() {
  const { state } = useApp()
  const profile = useCurrentProfile()
  const [showModal, setShowModal] = useState(false)
  const [editRun, setEditRun] = useState(null)
  const [filterProfile, setFilterProfile] = useState('all')
  const [assignRun, setAssignRun] = useState(null)

  const allRuns = [...state.freeRuns].sort((a, b) => new Date(b.date) - new Date(a.date))
  const filtered = filterProfile === 'all'
    ? allRuns
    : allRuns.filter((r) => r.profileId === filterProfile)

  const totalKm = filtered.reduce((s, r) => s + (r.distance || 0), 0)
  const totalSec = filtered.reduce((s, r) => s + (r.duration || 0), 0)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-gray-900 text-xl">ריצות חופשיות</h2>
          <p className="text-sm text-gray-500">ריצות מחוץ לתכנית</p>
        </div>
        <button
          onClick={() => { setEditRun(null); setShowModal(true) }}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          הוסף
        </button>
      </div>

      {/* Stats */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="card text-center py-3">
            <div className="text-2xl font-extrabold text-teal-600">{filtered.length}</div>
            <div className="text-xs text-gray-500">ריצות</div>
          </div>
          <div className="card text-center py-3">
            <div className="text-2xl font-extrabold text-green-600">{totalKm.toFixed(1)}</div>
            <div className="text-xs text-gray-500">ק"מ</div>
          </div>
          <div className="card text-center py-3">
            <div className="text-2xl font-extrabold text-blue-600">{toHours(totalSec)}</div>
            <div className="text-xs text-gray-500">שעות</div>
          </div>
        </div>
      )}

      {/* Filter */}
      {state.profiles.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterProfile('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors
              ${filterProfile === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            הכל
          </button>
          {state.profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => setFilterProfile(p.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors
                ${filterProfile === p.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <div className="w-4 h-4 rounded-full overflow-hidden bg-indigo-300 flex-shrink-0">
                {p.photo ? <img src={p.photo} alt="" className="w-full h-full object-cover" /> : null}
              </div>
              {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Runs list */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-3">🏃</div>
          <p className="font-semibold text-gray-700">עדיין אין ריצות חופשיות</p>
          <p className="text-sm text-gray-500 mt-1">הוסף ריצה עם החברים, ילדים, או סתם סיבוב בסביבה</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary mt-4 mx-auto"
          >
            הוסף ריצה ראשונה
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((run) => (
            <RunCard
              key={run.id}
              run={run}
              profiles={state.profiles}
              onClick={(r) => { setEditRun(r); setShowModal(true) }}
              onAssign={(r) => setAssignRun(r)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <FreeRunModal
          existing={editRun}
          onClose={() => { setShowModal(false); setEditRun(null) }}
        />
      )}

      {assignRun && (
        <AssignToWorkoutModal
          run={assignRun}
          onClose={() => setAssignRun(null)}
        />
      )}
    </div>
  )
}
