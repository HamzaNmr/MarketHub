"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { RegisterFormSchema } from "../lib/validation.schemas"

type UserData = z.infer<typeof RegisterFormSchema> | null

export function useAuthState() {
  const queryClient = useQueryClient()

  const { data: userData } = useQuery<UserData>({
    queryKey: ["auth", "userData"],
    queryFn: async () => queryClient.getQueryData(["auth", "userData"]) ?? null,
  })

  const { data: showOtp } = useQuery<boolean>({
    queryKey: ["auth", "showOtp"],
    queryFn: async () => queryClient.getQueryData(["auth", "showOtp"]) ?? false,
  })

  const { data: timer } = useQuery<number>({
    queryKey: ["auth", "timer"],
    queryFn: async () => queryClient.getQueryData(["auth", "timer"]) ?? 0,
  })

  const setUserData = (data: UserData) =>
    queryClient.setQueryData(["auth", "userData"], data)

  const setShowOtp = (value: boolean) =>
    queryClient.setQueryData(["auth", "showOtp"], value)

  const setTimer = (value: number) =>
    queryClient.setQueryData(["auth", "timer"], value)

  return {
    userData,
    setUserData,
    showOtp,
    setShowOtp,
    timer,
    setTimer,
  }
}
