export const RACE_DATE = new Date('2026-10-30T08:00:00')
export const PLAN_START = new Date('2026-06-14')

export const trainingPlan = [
  {
    week: 1,
    startDate: '2026-06-14',
    endDate: '2026-06-20',
    isRecovery: false,
    workouts: [
      {
        id: 'w1-a',
        label: 'אימון א׳',
        description: '4×(8 דק׳ ריצה + 2 דק׳ הליכה)',
        targetDuration: 40,
        type: 'intervals',
      },
      {
        id: 'w1-b',
        label: 'אימון ב׳',
        description: '4×(8 דק׳ ריצה + 2 דק׳ הליכה)',
        targetDuration: 40,
        type: 'intervals',
      },
    ],
  },
  {
    week: 2,
    startDate: '2026-06-21',
    endDate: '2026-06-27',
    isRecovery: false,
    workouts: [
      {
        id: 'w2-a',
        label: 'אימון א׳',
        description: '4×(8 דק׳ ריצה + 1 דק׳ הליכה)',
        targetDuration: 36,
        type: 'intervals',
      },
      {
        id: 'w2-b',
        label: 'אימון ב׳',
        description: '4×(8 דק׳ ריצה + 1 דק׳ הליכה)',
        targetDuration: 36,
        type: 'intervals',
      },
    ],
  },
  {
    week: 3,
    startDate: '2026-06-28',
    endDate: '2026-07-04',
    isRecovery: false,
    workouts: [
      {
        id: 'w3-a',
        label: 'אימון א׳',
        description: '32 דק׳ ריצה רציפה',
        targetDuration: 32,
        type: 'easy',
      },
      {
        id: 'w3-b',
        label: 'אימון ב׳',
        description: '32 דק׳ ריצה רציפה',
        targetDuration: 32,
        type: 'easy',
      },
    ],
  },
  {
    week: 4,
    startDate: '2026-07-05',
    endDate: '2026-07-11',
    isRecovery: false,
    workouts: [
      {
        id: 'w4-a',
        label: 'אימון א׳',
        description: '35 דק׳ ריצה',
        targetDuration: 35,
        type: 'easy',
      },
      {
        id: 'w4-b',
        label: 'אימון ב׳',
        description: '35 דק׳ ריצה',
        targetDuration: 35,
        type: 'easy',
      },
    ],
  },
  {
    week: 5,
    startDate: '2026-07-12',
    endDate: '2026-07-18',
    isRecovery: false,
    workouts: [
      {
        id: 'w5-a',
        label: 'אימון א׳',
        description: '39 דק׳ ריצה',
        targetDuration: 39,
        type: 'easy',
      },
      {
        id: 'w5-b',
        label: 'אימון ב׳',
        description: '39 דק׳ ריצה',
        targetDuration: 39,
        type: 'easy',
      },
    ],
  },
  {
    week: 6,
    startDate: '2026-07-19',
    endDate: '2026-07-25',
    isRecovery: false,
    workouts: [
      {
        id: 'w6-a',
        label: 'אימון א׳',
        description: '43 דק׳ ריצה',
        targetDuration: 43,
        type: 'easy',
      },
      {
        id: 'w6-b',
        label: 'אימון ב׳',
        description: '43 דק׳ ריצה',
        targetDuration: 43,
        type: 'easy',
      },
    ],
  },
  {
    week: 7,
    startDate: '2026-07-26',
    endDate: '2026-08-01',
    isRecovery: true,
    workouts: [
      {
        id: 'w7-a',
        label: 'אימון א׳ (שבוע התאוששות)',
        description: '39 דק׳ ריצה — חזרה על שבוע 5',
        targetDuration: 39,
        type: 'easy',
      },
      {
        id: 'w7-b',
        label: 'אימון ב׳ (שבוע התאוששות)',
        description: '39 דק׳ ריצה — חזרה על שבוע 5',
        targetDuration: 39,
        type: 'easy',
      },
    ],
  },
  {
    week: 8,
    startDate: '2026-08-02',
    endDate: '2026-08-08',
    isRecovery: false,
    workouts: [
      {
        id: 'w8-a',
        label: 'אימון א׳',
        description: '47 דק׳ ריצה',
        targetDuration: 47,
        type: 'easy',
      },
      {
        id: 'w8-b',
        label: 'אימון ב׳',
        description: '47 דק׳ ריצה',
        targetDuration: 47,
        type: 'easy',
      },
    ],
  },
  {
    week: 9,
    startDate: '2026-08-09',
    endDate: '2026-08-15',
    isRecovery: false,
    workouts: [
      {
        id: 'w9-a',
        label: 'אימון א׳ — ריצה ארוכה',
        description: '52 דק׳ ריצה',
        targetDuration: 52,
        type: 'long',
      },
      {
        id: 'w9-b',
        label: 'אימון ב׳ — איכות',
        description: '6×(3 דק׳ מהיר + 2 דק׳ הליכה) — 40 דק׳ כולל',
        targetDuration: 40,
        type: 'quality',
      },
    ],
  },
  {
    week: 10,
    startDate: '2026-08-16',
    endDate: '2026-08-22',
    isRecovery: false,
    workouts: [
      {
        id: 'w10-a',
        label: 'אימון א׳ — ריצה ארוכה',
        description: '57 דק׳ ריצה',
        targetDuration: 57,
        type: 'long',
      },
      {
        id: 'w10-b',
        label: 'אימון ב׳ — איכות',
        description: '6×(3 דק׳ מהיר + 2 דק׳ הליכה) — 40 דק׳ כולל',
        targetDuration: 40,
        type: 'quality',
      },
    ],
  },
  {
    week: 11,
    startDate: '2026-08-23',
    endDate: '2026-08-29',
    isRecovery: false,
    workouts: [
      {
        id: 'w11-a',
        label: 'אימון א׳ — ריצה ארוכה',
        description: '63 דק׳ ריצה',
        targetDuration: 63,
        type: 'long',
      },
      {
        id: 'w11-b',
        label: 'אימון ב׳ — איכות',
        description: '6×(3 דק׳ מהיר + 2 דק׳ הליכה) — 40 דק׳ כולל',
        targetDuration: 40,
        type: 'quality',
      },
    ],
  },
  {
    week: 12,
    startDate: '2026-08-30',
    endDate: '2026-09-05',
    isRecovery: false,
    workouts: [
      {
        id: 'w12-a',
        label: 'אימון א׳ — ריצה ארוכה',
        description: '69 דק׳ ריצה',
        targetDuration: 69,
        type: 'long',
      },
      {
        id: 'w12-b',
        label: 'אימון ב׳ — איכות',
        description: '7×(3 דק׳ מהיר + 90 שנ׳ הליכה) — 40 דק׳ כולל',
        targetDuration: 40,
        type: 'quality',
      },
    ],
  },
  {
    week: 13,
    startDate: '2026-09-06',
    endDate: '2026-09-12',
    isRecovery: false,
    workouts: [
      {
        id: 'w13-a',
        label: 'אימון א׳ — ריצה ארוכה',
        description: '76 דק׳ ריצה',
        targetDuration: 76,
        type: 'long',
      },
      {
        id: 'w13-b',
        label: 'אימון ב׳ — איכות',
        description: '7×(3 דק׳ מהיר + 90 שנ׳ הליכה) — 40 דק׳ כולל',
        targetDuration: 40,
        type: 'quality',
      },
    ],
  },
  {
    week: 14,
    startDate: '2026-09-13',
    endDate: '2026-09-19',
    isRecovery: true,
    workouts: [
      {
        id: 'w14-a',
        label: 'אימון א׳ (שבוע התאוששות)',
        description: '63 דק׳ ריצה — חזרה על שבוע 11',
        targetDuration: 63,
        type: 'long',
      },
      {
        id: 'w14-b',
        label: 'אימון ב׳ (שבוע התאוששות)',
        description: '6×(3 דק׳ מהיר + 2 דק׳ הליכה) — 40 דק׳ כולל',
        targetDuration: 40,
        type: 'quality',
      },
    ],
  },
  {
    week: 15,
    startDate: '2026-09-20',
    endDate: '2026-09-26',
    isRecovery: false,
    workouts: [
      {
        id: 'w15-a',
        label: 'אימון א׳ — ריצה ארוכה',
        description: '84 דק׳ ריצה',
        targetDuration: 84,
        type: 'long',
      },
      {
        id: 'w15-b',
        label: 'אימון ב׳ — איכות',
        description: '8×(3 דק׳ מהיר + 90 שנ׳ הליכה) — 40 דק׳ כולל',
        targetDuration: 40,
        type: 'quality',
      },
    ],
  },
  {
    week: 16,
    startDate: '2026-09-27',
    endDate: '2026-10-03',
    isRecovery: false,
    workouts: [
      {
        id: 'w16-a',
        label: 'אימון א׳ — ריצה ארוכה',
        description: '92 דק׳ ריצה',
        targetDuration: 92,
        type: 'long',
      },
      {
        id: 'w16-b',
        label: 'אימון ב׳ — איכות',
        description: '8×(3 דק׳ מהיר + 90 שנ׳ הליכה) — 40 דק׳ כולל',
        targetDuration: 40,
        type: 'quality',
      },
    ],
  },
  {
    week: 17,
    startDate: '2026-10-04',
    endDate: '2026-10-10',
    isRecovery: false,
    isTaper: true,
    workouts: [
      {
        id: 'w17-a',
        label: 'אימון א׳ — הורדת עומס',
        description: '65 דק׳ ריצה',
        targetDuration: 65,
        type: 'easy',
      },
      {
        id: 'w17-b',
        label: 'אימון ב׳ — הורדת עומס',
        description: '30 דק׳ קל',
        targetDuration: 30,
        type: 'easy',
      },
    ],
  },
  {
    week: 18,
    startDate: '2026-10-11',
    endDate: '2026-10-17',
    isRecovery: false,
    isTaper: true,
    workouts: [
      {
        id: 'w18-a',
        label: 'אימון א׳ — הורדת עומס',
        description: '45 דק׳ ריצה',
        targetDuration: 45,
        type: 'easy',
      },
      {
        id: 'w18-b',
        label: 'אימון ב׳ — הורדת עומס',
        description: '20 דק׳ קל',
        targetDuration: 20,
        type: 'easy',
      },
    ],
  },
  {
    week: 19,
    startDate: '2026-10-18',
    endDate: '2026-10-24',
    isRecovery: false,
    isTaper: true,
    workouts: [
      {
        id: 'w19-a',
        label: 'אימון א׳ — ג׳וג קל',
        description: '25 דק׳ ג׳וג קל',
        targetDuration: 25,
        type: 'easy',
      },
      {
        id: 'w19-b',
        label: 'אימון ב׳ — הליכה בלבד',
        description: 'הליכה בלבד',
        targetDuration: 30,
        type: 'walk',
      },
    ],
  },
  {
    week: 20,
    startDate: '2026-10-25',
    endDate: '2026-10-30',
    isRecovery: false,
    isTaper: true,
    isRaceWeek: true,
    workouts: [
      {
        id: 'w20-a',
        label: 'ראשון — ג׳וג קל',
        description: '15 דק׳ ג׳וג קל (25/10)',
        targetDuration: 15,
        type: 'easy',
      },
      {
        id: 'w20-b',
        label: '🏁 יום המרוץ — 30 באוקטובר',
        description: 'המרוץ! בהצלחה!',
        targetDuration: null,
        type: 'race',
      },
    ],
  },
]

/**
 * Plan V2 — 5% gradual progression, quality runs from 60 min, flat/knee-friendly.
 * Weeks 1-3 identical to V1 so REPLACE_PLAN preserveWeeks=3 works seamlessly.
 */
export const trainingPlanV2 = [
  // ── Weeks 1–3: identical to V1 ───────────────────────────────────
  {
    week: 1, startDate: '2026-06-14', endDate: '2026-06-20', isRecovery: false,
    workouts: [
      { id: 'v2-w1-a', label: 'אימון א׳', description: '4×(8 דק׳ ריצה + 2 דק׳ הליכה)', targetDuration: 40, type: 'intervals' },
      { id: 'v2-w1-b', label: 'אימון ב׳', description: '4×(8 דק׳ ריצה + 2 דק׳ הליכה)', targetDuration: 40, type: 'intervals' },
    ],
  },
  {
    week: 2, startDate: '2026-06-21', endDate: '2026-06-27', isRecovery: false,
    workouts: [
      { id: 'v2-w2-a', label: 'אימון א׳', description: '4×(8 דק׳ ריצה + 1 דק׳ הליכה)', targetDuration: 36, type: 'intervals' },
      { id: 'v2-w2-b', label: 'אימון ב׳', description: '4×(8 דק׳ ריצה + 1 דק׳ הליכה)', targetDuration: 36, type: 'intervals' },
    ],
  },
  {
    week: 3, startDate: '2026-06-28', endDate: '2026-07-04', isRecovery: false,
    workouts: [
      { id: 'v2-w3-a', label: 'אימון א׳', description: '32 דק׳ ריצה רציפה', targetDuration: 32, type: 'easy' },
      { id: 'v2-w3-b', label: 'אימון ב׳', description: '32 דק׳ ריצה רציפה', targetDuration: 32, type: 'easy' },
    ],
  },

  // ── Weeks 4–8: build to 60 min (5%/week), all easy ───────────────
  {
    week: 4, startDate: '2026-07-05', endDate: '2026-07-11', isRecovery: false,
    workouts: [
      { id: 'v2-w4-a', label: 'אימון א׳', description: '50 דק׳ ריצה רציפה בקצב קל', targetDuration: 50, type: 'easy' },
      { id: 'v2-w4-b', label: 'אימון ב׳', description: '50 דק׳ ריצה רציפה בקצב קל', targetDuration: 50, type: 'easy' },
    ],
  },
  {
    week: 5, startDate: '2026-07-12', endDate: '2026-07-18', isRecovery: false,
    workouts: [
      { id: 'v2-w5-a', label: 'אימון א׳', description: '53 דק׳ ריצה רציפה בקצב קל', targetDuration: 53, type: 'easy' },
      { id: 'v2-w5-b', label: 'אימון ב׳', description: '53 דק׳ ריצה רציפה בקצב קל', targetDuration: 53, type: 'easy' },
    ],
  },
  {
    week: 6, startDate: '2026-07-19', endDate: '2026-07-25', isRecovery: false,
    workouts: [
      { id: 'v2-w6-a', label: 'אימון א׳', description: '56 דק׳ ריצה רציפה בקצב קל', targetDuration: 56, type: 'easy' },
      { id: 'v2-w6-b', label: 'אימון ב׳', description: '56 דק׳ ריצה רציפה בקצב קל', targetDuration: 56, type: 'easy' },
    ],
  },
  {
    week: 7, startDate: '2026-07-26', endDate: '2026-08-01', isRecovery: true,
    workouts: [
      { id: 'v2-w7-a', label: 'אימון א׳ (שבוע התאוששות)', description: '45 דק׳ ריצה קלה — שבוע מנוחה פעילה', targetDuration: 45, type: 'easy' },
      { id: 'v2-w7-b', label: 'אימון ב׳ (שבוע התאוששות)', description: '45 דק׳ ריצה קלה — שבוע מנוחה פעילה', targetDuration: 45, type: 'easy' },
    ],
  },
  {
    week: 8, startDate: '2026-08-02', endDate: '2026-08-08', isRecovery: false,
    workouts: [
      { id: 'v2-w8-a', label: 'אימון א׳', description: '59 דק׳ ריצה רציפה בקצב קל', targetDuration: 59, type: 'easy' },
      { id: 'v2-w8-b', label: 'אימון ב׳', description: '59 דק׳ ריצה רציפה בקצב קל', targetDuration: 59, type: 'easy' },
    ],
  },

  // ── Weeks 9–11: quality A + easy long B ──────────────────────────
  {
    week: 9, startDate: '2026-08-09', endDate: '2026-08-15', isRecovery: false,
    workouts: [
      {
        id: 'v2-w9-a', label: 'אימון א׳ — פארטלק שטוח', type: 'quality', targetDuration: 40,
        description: 'חימום 10 דק׳ קל → 5×(3 דק׳ קצב טמפו + 2 דק׳ קל) → שחרור 5 דק׳\nשטח שטוח בלבד — ללא עליות/ירידות',
      },
      { id: 'v2-w9-b', label: 'אימון ב׳ — ריצה ארוכה קלה', description: '62 דק׳ ריצה רציפה בקצב קל', targetDuration: 62, type: 'long' },
    ],
  },
  {
    week: 10, startDate: '2026-08-16', endDate: '2026-08-22', isRecovery: false,
    workouts: [
      {
        id: 'v2-w10-a', label: 'אימון א׳ — אינטרוולים שטוחים', type: 'quality', targetDuration: 42,
        description: 'חימום 10 דק׳ קל → 6×(3 דק׳ טמפו + 90 שנ׳ קל) → שחרור 5 דק׳\nשטח שטוח — ריצה שיפורי קצב, לא מירוץ',
      },
      { id: 'v2-w10-b', label: 'אימון ב׳ — ריצה ארוכה קלה', description: '65 דק׳ ריצה רציפה בקצב קל', targetDuration: 65, type: 'long' },
    ],
  },
  {
    week: 11, startDate: '2026-08-23', endDate: '2026-08-29', isRecovery: false,
    workouts: [
      {
        id: 'v2-w11-a', label: 'אימון א׳ — בלוקי טמפו שטוחים', type: 'quality', targetDuration: 44,
        description: 'חימום 10 דק׳ קל → 3×(10 דק׳ קצב טמפו + 2 דק׳ קל) → שחרור 2 דק׳\nשטח שטוח — קצב מאתגר אך שמור',
      },
      { id: 'v2-w11-b', label: 'אימון ב׳ — ריצה ארוכה קלה', description: '68 דק׳ ריצה רציפה בקצב קל', targetDuration: 68, type: 'long' },
    ],
  },

  // ── Week 12: recovery ─────────────────────────────────────────────
  {
    week: 12, startDate: '2026-08-30', endDate: '2026-09-05', isRecovery: true,
    workouts: [
      {
        id: 'v2-w12-a', label: 'אימון א׳ — פארטלק קל (שבוע התאוששות)', type: 'quality', targetDuration: 35,
        description: 'חימום 10 דק׳ קל → 4×(3 דק׳ טמפו + 2 דק׳ קל) → שחרור 5 דק׳\nשטח שטוח — עצימות מתונה, שבוע מנוחה',
      },
      { id: 'v2-w12-b', label: 'אימון ב׳ (שבוע התאוששות)', description: '56 דק׳ ריצה רציפה קלה', targetDuration: 56, type: 'easy' },
    ],
  },

  // ── Weeks 13–15: quality A + easy long B ─────────────────────────
  {
    week: 13, startDate: '2026-09-06', endDate: '2026-09-12', isRecovery: false,
    workouts: [
      {
        id: 'v2-w13-a', label: 'אימון א׳ — בלוקי טמפו שטוחים', type: 'quality', targetDuration: 47,
        description: 'חימום 10 דק׳ קל → 4×(8 דק׳ קצב טמפו + 3 דק׳ קל) → שחרור 5 דק׳\nשטח שטוח — קצב מהיר מקצב המרוץ ב~15-20 שנ׳',
      },
      { id: 'v2-w13-b', label: 'אימון ב׳ — ריצה ארוכה קלה', description: '71 דק׳ ריצה רציפה בקצב קל', targetDuration: 71, type: 'long' },
    ],
  },
  {
    week: 14, startDate: '2026-09-13', endDate: '2026-09-19', isRecovery: false,
    workouts: [
      {
        id: 'v2-w14-a', label: 'אימון א׳ — ריצת פרוגרסייה שטוחה', type: 'quality', targetDuration: 48,
        description: 'חימום 5 דק׳ → 30 דק׳ קצב קל → 15 דק׳ בקצב המרוץ המיועד → שחרור 3 דק׳\nשטח שטוח — גיוס הגוף לסיים חזק',
      },
      { id: 'v2-w14-b', label: 'אימון ב׳ — ריצה ארוכה קלה', description: '75 דק׳ ריצה רציפה בקצב קל', targetDuration: 75, type: 'long' },
    ],
  },
  {
    week: 15, startDate: '2026-09-20', endDate: '2026-09-26', isRecovery: false,
    workouts: [
      {
        id: 'v2-w15-a', label: 'אימון א׳ — בלוקי טמפו ארוכים', type: 'quality', targetDuration: 52,
        description: 'חימום 10 דק׳ קל → 5×(8 דק׳ קצב טמפו + 2 דק׳ קל) → שחרור 2 דק׳\nשטח שטוח — האימון הכי קרוב לתחושת המרוץ',
      },
      { id: 'v2-w15-b', label: 'אימון ב׳ — ריצה ארוכה קלה', description: '79 דק׳ ריצה רציפה בקצב קל', targetDuration: 79, type: 'long' },
    ],
  },

  // ── Week 16: recovery ─────────────────────────────────────────────
  {
    week: 16, startDate: '2026-09-27', endDate: '2026-10-03', isRecovery: true,
    workouts: [
      {
        id: 'v2-w16-a', label: 'אימון א׳ — פארטלק קל (שבוע התאוששות)', type: 'quality', targetDuration: 38,
        description: 'חימום 10 דק׳ → 4×(3 דק׳ טמפו + 2 דק׳ קל) → שחרור 8 דק׳\nשטח שטוח — שבוע מנוחה לפני פיק',
      },
      { id: 'v2-w16-b', label: 'אימון ב׳ (שבוע התאוששות)', description: '65 דק׳ ריצה קלה', targetDuration: 65, type: 'easy' },
    ],
  },

  // ── Week 17: peak ─────────────────────────────────────────────────
  {
    week: 17, startDate: '2026-10-04', endDate: '2026-10-10', isRecovery: false,
    workouts: [
      {
        id: 'v2-w17-a', label: 'אימון א׳ — פיק: פרוגרסייה שטוחה', type: 'quality', targetDuration: 57,
        description: 'חימום 5 דק׳ → 30 דק׳ קצב קל → 25 דק׳ בקצב המרוץ המיועד → שחרור 2 דק׳\nשטח שטוח — אימון השיא לפני הורדת עומס',
      },
      { id: 'v2-w17-b', label: 'אימון ב׳ — ריצה ארוכה קלה (פיק)', description: '83 דק׳ ריצה רציפה בקצב קל — הריצה הארוכה ביותר', targetDuration: 83, type: 'long' },
    ],
  },

  // ── Weeks 18–20: taper + race ─────────────────────────────────────
  {
    week: 18, startDate: '2026-10-11', endDate: '2026-10-17', isRecovery: false, isTaper: true,
    workouts: [
      { id: 'v2-w18-a', label: 'אימון א׳ — הורדת עומס', description: '35 דק׳ קל עם 4 strides של 20 שנ׳ בסיום (שטוח)', targetDuration: 35, type: 'easy' },
      { id: 'v2-w18-b', label: 'אימון ב׳ — הורדת עומס', description: '50 דק׳ ריצה קלה', targetDuration: 50, type: 'easy' },
    ],
  },
  {
    week: 19, startDate: '2026-10-18', endDate: '2026-10-24', isRecovery: false, isTaper: true,
    workouts: [
      { id: 'v2-w19-a', label: 'אימון א׳ — ג׳וג קל', description: '25 דק׳ ג׳וג קל עם 3 strides קצרים (שטוח)', targetDuration: 25, type: 'easy' },
      { id: 'v2-w19-b', label: 'אימון ב׳ — הליכה + ג׳וג', description: '20 דק׳ הליכה ואופציונלית 10 דק׳ ג׳וג קל', targetDuration: 20, type: 'walk' },
    ],
  },
  {
    week: 20, startDate: '2026-10-25', endDate: '2026-10-30', isRecovery: false, isTaper: true, isRaceWeek: true,
    workouts: [
      { id: 'v2-w20-a', label: 'ראשון — ג׳וג קל', description: '15 דק׳ ג׳וג קל עם 2–3 strides (26/10)', targetDuration: 15, type: 'easy' },
      { id: 'v2-w20-b', label: '🏁 יום המרוץ — 30 באוקטובר', description: 'המרוץ! בהצלחה! 🎉', targetDuration: null, type: 'race' },
    ],
  },
]

export function generateWeeksFromTemplateV2(startDate) {
  const templateStart = new Date(trainingPlanV2[0].startDate)
  const newStart = new Date(startDate)
  const diffMs = newStart.getTime() - templateStart.getTime()
  return trainingPlanV2.map((week) => ({
    ...week,
    workouts: week.workouts.map((w) => ({ ...w })),
    startDate: new Date(new Date(week.startDate).getTime() + diffMs).toISOString().slice(0, 10),
    endDate: new Date(new Date(week.endDate).getTime() + diffMs).toISOString().slice(0, 10),
  }))
}

export function getCurrentWeek(weeks = trainingPlan) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (const week of weeks) {
    const start = new Date(week.startDate)
    const end = new Date(week.endDate)
    end.setHours(23, 59, 59)
    if (today >= start && today <= end) return week
  }
  if (today < new Date(weeks[0].startDate)) return null
  return weeks[weeks.length - 1]
}

export function getWeekForDate(date, weeks = trainingPlan) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  for (const week of weeks) {
    const start = new Date(week.startDate)
    const end = new Date(week.endDate)
    end.setHours(23, 59, 59)
    if (d >= start && d <= end) return week
  }
  return null
}

/**
 * Clone the 20-week template, shifting all dates so week 1 starts on `startDate`.
 */
export function generateWeeksFromTemplate(startDate) {
  const templateStart = new Date(trainingPlan[0].startDate)
  const newStart = new Date(startDate)
  const diffMs = newStart.getTime() - templateStart.getTime()

  return trainingPlan.map((week) => ({
    ...week,
    workouts: week.workouts.map((w) => ({ ...w })),
    startDate: new Date(new Date(week.startDate).getTime() + diffMs).toISOString().slice(0, 10),
    endDate: new Date(new Date(week.endDate).getTime() + diffMs).toISOString().slice(0, 10),
  }))
}

/**
 * Generate empty weeks between startDate and raceDate (7 days each),
 * each with two blank workouts.
 */
export function generateEmptyWeeks(startDate, raceDate) {
  const start = new Date(startDate)
  const end = new Date(raceDate)
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  const numWeeks = Math.max(1, Math.ceil(totalDays / 7))
  const MS_WEEK = 7 * 24 * 60 * 60 * 1000

  return Array.from({ length: numWeeks }, (_, i) => {
    const wStart = new Date(start.getTime() + i * MS_WEEK)
    const wEnd = new Date(Math.min(wStart.getTime() + 6 * 24 * 60 * 60 * 1000, end.getTime()))
    return {
      week: i + 1,
      startDate: wStart.toISOString().slice(0, 10),
      endDate: wEnd.toISOString().slice(0, 10),
      isRecovery: false,
      isTaper: false,
      isRaceWeek: i === numWeeks - 1,
      workouts: [
        { id: `cw${i + 1}-a`, label: 'אימון א׳', description: '', targetDuration: null, type: 'easy' },
        { id: `cw${i + 1}-b`, label: 'אימון ב׳', description: '', targetDuration: null, type: 'easy' },
      ],
    }
  })
}

export const typeLabels = {
  intervals: 'אינטרוולים',
  easy: 'קל',
  long: 'ארוך',
  quality: 'איכות',
  walk: 'הליכה',
  race: 'מרוץ',
}

export const typeColors = {
  intervals: 'bg-purple-100 text-purple-700',
  easy: 'bg-blue-100 text-blue-700',
  long: 'bg-orange-100 text-orange-700',
  quality: 'bg-red-100 text-red-700',
  walk: 'bg-green-100 text-green-700',
  race: 'bg-yellow-100 text-yellow-700',
}
