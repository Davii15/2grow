'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setAuthorized(false)
        router.push('/signin')
      } else {
        setAuthorized(true)
      }
    }

    checkAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setAuthorized(false)
        router.push('/signin')
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  return authorized ? <>{children}</> : null
}

export default RouteGuard

