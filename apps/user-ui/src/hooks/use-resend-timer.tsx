import { useEffect } from 'react'
import { useAuthState } from './use-auth-state'
import { useQueryClient } from '@tanstack/react-query'
import { authKeys } from '../lib/queryKeys'

export function useResendTimer(initial: number = 60) {
  const queryClient = useQueryClient()
  const { timer, setTimer } = useAuthState()

  // Can derive "canResend" from timer
  const canResend = timer === 0

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (!canResend) {
      interval = setInterval(() => {
        queryClient.setQueryData(authKeys.timer, (prev: number = initial) => {
          if (prev <= 1) {
            clearInterval(interval!)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [canResend, queryClient, initial])

  const start = () => {
    setTimer(initial)
  }

  return { timer, canResend, start }
}
