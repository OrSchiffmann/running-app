import React, { useState } from 'react'
import { BODY_AREAS } from '../data/exercises'
import { buildTabatas } from '../utils/tabataBuilder'

const TABATA_OPTIONS = [4, 6, 8, 10, 12]

const SECTION_META = {
  warmup: { label: 'חימום', color: 'bg-green-100 text-green-700', icon: '🌱' },
  peak:   { label: 'שיא עצימות', color: 'bg-red-100 text-red-700', icon: '🔥' },
}

function TabataCard({ tabata }) {
  const [ex1, ex2] = tabata.exercises
  const section = SECTION_META[tabata.section]
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0">
          {tabata.num}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="font-bold text-gray-900 text-sm">טאבטה {tabata.num}</div>
            {section && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${section.color}`}>
                {section.icon} {section.label}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400">20 שנ׳ עבודה / 10 שנ׳ מנוחה × 8 סטים</div>
        </div>
      </div>

      <div className="space-y-2">
        {[ex1, ex2].map((ex, i) => (
          <div key={ex.id + i} className="flex gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
            <span className="text-2xl flex-shrink-0">{ex.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-gray-900">{ex.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{ex.description}</div>
              {ex.tip && (
                <div className="text-xs text-indigo-600 mt-1 font-medium">💡 {ex.tip}</div>
              )}
            </div>
            <div className="flex-shrink-0 flex flex-col items-end gap-1">
              {ex.areas.slice(0, 2).map((area) => {
                const areaObj = BODY_AREAS.find((a) => a.id === area)
                return areaObj ? (
                  <span key={area} className="text-[10px] bg-indigo-100 text-indigo-700 rounded-full px-2 py-0.5 font-semibold whitespace-nowrap">
                    {areaObj.label}
                  </span>
                ) : null
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-50 flex justify-center gap-4 text-xs text-gray-400">
        <span>סה״כ: ~4 דקות</span>
        <span>•</span>
        <span>מחזור: 20+10 שנ׳</span>
        <span>•</span>
        <span>8 סטים</span>
      </div>
    </div>
  )
}

function WorkoutSummary({ tabatas }) {
  const totalMin = tabatas.length * 4 + Math.ceil(tabatas.length / 2) // ~30s rest between tabatas
  const areas = [...new Set(tabatas.flatMap((t) => t.exercises.flatMap((e) => e.areas)))]
  return (
    <div className="card bg-gradient-to-l from-indigo-50 to-purple-50 border-indigo-100">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-extrabold text-gray-900 text-lg">{tabatas.length} טאבטות</div>
          <div className="text-sm text-gray-500">~{totalMin} דקות כולל מנוחות</div>
        </div>
        <div className="text-4xl">🔥</div>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {areas.map((areaId) => {
          const area = BODY_AREAS.find((a) => a.id === areaId)
          return area ? (
            <span key={areaId} className="text-xs bg-white border border-indigo-200 text-indigo-700 rounded-full px-2 py-0.5 font-semibold">
              {area.emoji} {area.label}
            </span>
          ) : null
        })}
      </div>
    </div>
  )
}

export default function StrengthPage() {
  const [selectedAreas, setSelectedAreas] = useState([])
  const [numTabatas, setNumTabatas] = useState(6)
  const [tabatas, setTabatas] = useState(null)
  const [step, setStep] = useState('form') // 'form' | 'workout'

  function toggleArea(id) {
    setSelectedAreas((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    )
  }

  function generate() {
    if (!selectedAreas.length) return
    const result = buildTabatas(selectedAreas, numTabatas)
    setTabatas(result)
    setStep('workout')
  }

  function regenerate() {
    const result = buildTabatas(selectedAreas, numTabatas)
    setTabatas(result)
  }

  function reset() {
    setStep('form')
    setTabatas(null)
  }

  if (step === 'workout' && tabatas) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-gray-900 text-xl">אימון חיזוק 💪</h2>
          <button onClick={reset} className="text-sm text-gray-500 hover:text-gray-700 font-semibold">
            ← חזרה
          </button>
        </div>

        <WorkoutSummary tabatas={tabatas} />

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 font-medium">
          כל טאבטה: תרגיל א׳ 20 שנ׳ → מנוחה 10 שנ׳ → תרגיל ב׳ 20 שנ׳ → מנוחה 10 שנ׳ — חוזרים 4 פעמים סה״כ 8 סטים
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-800 font-medium">
          🦵 כל התרגילים מותאמים לרגישות ברך (ללא לאנג׳ים, ללא נחיתות) ולרגישות כף יד (על המרפקים)
        </div>

        {tabatas.map((t) => (
          <TabataCard key={t.num} tabata={t} />
        ))}

        <button
          onClick={regenerate}
          className="w-full card flex items-center justify-center gap-2 text-indigo-600 font-bold hover:bg-indigo-50 transition-colors border-dashed border-2 border-indigo-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          בנה אימון חדש עם אותן העדפות
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-extrabold text-gray-900 text-xl">אימון חיזוק 💪</h2>
        <p className="text-sm text-gray-500 mt-1">בני אימון טאבטה מותאם אישית</p>
      </div>

      {/* Body area selection */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">על מה תרצי לעבוד?</h3>
        <div className="grid grid-cols-2 gap-2">
          {BODY_AREAS.map((area) => {
            const selected = selectedAreas.includes(area.id)
            return (
              <button
                key={area.id}
                onClick={() => toggleArea(area.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 text-right transition-all
                  ${selected
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-indigo-200'
                  }`}
              >
                <span className="text-xl flex-shrink-0">{area.emoji}</span>
                <span className={`text-sm font-semibold ${selected ? 'text-indigo-700' : 'text-gray-700'}`}>
                  {area.label}
                </span>
                {selected && (
                  <div className="mr-auto w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>
        {selectedAreas.length === 0 && (
          <p className="text-xs text-gray-400 text-center mt-2">בחרי לפחות איזור אחד</p>
        )}
      </div>

      {/* Number of tabatas */}
      <div>
        <h3 className="font-bold text-gray-800 mb-3">כמה טאבטות?</h3>
        <div className="flex gap-2">
          {TABATA_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => setNumTabatas(n)}
              className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all
                ${numTabatas === n
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-600 hover:border-indigo-200'
                }`}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          ~{numTabatas * 4 + Math.ceil(numTabatas / 2)} דקות כולל מנוחות
        </p>
      </div>

      {/* Generate button */}
      <button
        onClick={generate}
        disabled={!selectedAreas.length}
        className="w-full btn-primary py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed"
      >
        בני לי אימון 🔥
      </button>
    </div>
  )
}
