import { exercises } from '../data/exercises'

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Score how "different" two exercises are for pairing (higher = better pair)
function pairScore(a, b) {
  let score = 0
  // Different category = great (upper+lower, core+cardio, etc.)
  if (a.category !== b.category) score += 3
  // No shared areas = good
  const sharedAreas = a.areas.filter((ar) => b.areas.includes(ar))
  score -= sharedAreas.length
  return score
}

/**
 * Build N tabatas from the given body area IDs.
 * Each tabata = 2 exercises.
 * Logic:
 *  1. Filter exercises that cover at least one selected area.
 *  2. Greedily pair exercises trying to maximize pairScore (different categories/areas).
 *  3. If pool is smaller than 2×N, cycle through reshuffled pool.
 */
export function buildTabatas(selectedAreaIds, numTabatas) {
  if (!selectedAreaIds.length || numTabatas < 1) return []

  // Filter pool
  const pool = exercises.filter((ex) =>
    ex.areas.some((a) => selectedAreaIds.includes(a))
  )

  if (pool.length < 2) return []

  // We may need more exercises than the pool — allow repeats in cycles
  const needed = numTabatas * 2
  let deck = []
  while (deck.length < needed) {
    deck = [...deck, ...shuffle(pool)]
  }

  // Greedy pairing: pick first exercise, then find best partner from the rest
  const tabatas = []
  const used = new Set()
  let deckIdx = 0

  // Advance past used
  function nextUnused() {
    while (deckIdx < deck.length && used.has(deck[deckIdx].id + deckIdx)) deckIdx++
    return deck[deckIdx]
  }

  for (let t = 0; t < numTabatas; t++) {
    // Pick first exercise
    const firstIdx = deckIdx
    const first = deck[firstIdx]
    used.add(first.id + firstIdx)
    deckIdx++

    // Find best partner among next candidates (look ahead up to 8)
    let bestPartnerIdx = deckIdx
    let bestScore = -Infinity
    const lookAhead = Math.min(8, deck.length - deckIdx)
    for (let k = 0; k < lookAhead; k++) {
      const idx = deckIdx + k
      if (used.has(deck[idx].id + idx)) continue
      const score = pairScore(first, deck[idx])
      if (score > bestScore) {
        bestScore = score
        bestPartnerIdx = idx
      }
    }

    const second = deck[bestPartnerIdx]
    used.add(second.id + bestPartnerIdx)
    // Swap best partner to current position so deckIdx advances past it
    ;[deck[deckIdx], deck[bestPartnerIdx]] = [deck[bestPartnerIdx], deck[deckIdx]]
    deckIdx++

    tabatas.push({ exercises: [first, second] })
  }

  // Sort by average warmupScore (ascending): lower = warmup-suitable, higher = peak intensity
  tabatas.sort((a, b) => {
    const avgA = (a.exercises[0].warmupScore + a.exercises[1].warmupScore) / 2
    const avgB = (b.exercises[0].warmupScore + b.exercises[1].warmupScore) / 2
    return avgA - avgB
  })

  // Re-number and assign section labels
  return tabatas.map((t, i) => {
    let section = null
    if (i === 0) section = 'warmup'
    else if (i === tabatas.length - 1 && tabatas.length >= 3) section = 'peak'
    return { ...t, num: i + 1, section }
  })
}
