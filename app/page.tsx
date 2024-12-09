'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../utils/supabase'
import { AuthTabs } from '@/components/auth/auth-tabs'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      }
    }
    
    checkUser()
  }, [router])

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
            TradingView Strategy Generator
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Generate powerful trading strategies with ease
          </p>
        </div>
        <div className="w-full flex justify-center">
          <AuthTabs />
        </div>
      </div>
    </main>
  )
}
