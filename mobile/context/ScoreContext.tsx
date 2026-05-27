import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = '@future-trace/scores-generated-count'

type ScoreContextValue = {
  scoresGeneratedCount: number
  recordScoreGeneration: () => void
}

const ScoreContext = createContext<ScoreContextValue | null>(null)

export function ScoreProvider({ children }: { children: ReactNode }) {
  const [scoresGeneratedCount, setScoresGeneratedCount] = useState(0)

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        const parsed = value ? Number.parseInt(value, 10) : 0
        setScoresGeneratedCount(Number.isFinite(parsed) && parsed > 0 ? parsed : 0)
      })
      .catch(() => {})
  }, [])

  const recordScoreGeneration = useCallback(() => {
    setScoresGeneratedCount((previous) => {
      const next = previous + 1
      AsyncStorage.setItem(STORAGE_KEY, String(next)).catch(() => {})
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ scoresGeneratedCount, recordScoreGeneration }),
    [scoresGeneratedCount, recordScoreGeneration]
  )

  return <ScoreContext.Provider value={value}>{children}</ScoreContext.Provider>
}

export function useScoreStats() {
  const context = useContext(ScoreContext)
  if (!context) {
    throw new Error('useScoreStats must be used within ScoreProvider')
  }
  return context
}
