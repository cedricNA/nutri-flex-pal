import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'

export function useFoodGroups() {
  const [groups, setGroups] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('foods_clean')
        .select('group_fr')
        .limit(1000)
      if (!mounted) return
      if (error) {
        setError(error.message)
      } else {
        const unique = Array.from(
          new Set((data as any[]).map(d => d.group_fr).filter(Boolean))
        ) as string[]
        setGroups(unique)
      }
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [])

  return { groups, loading, error }
}
