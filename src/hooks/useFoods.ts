import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'
import type { FoodClean } from '@/types/supabase'

const PAGE_SIZE = 20

interface Params {
  search?: string
  group?: string
  page?: number
  limit?: number
}

export function useFoods({
  search = '',
  group = '',
  page = 0,
  limit = PAGE_SIZE
}: Params) {
  const [foods, setFoods] = useState<FoodClean[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      const from = page * limit
      const to = from + limit - 1
      let query = supabase
        .from('foods_clean')
        .select('*', { count: 'exact' })
        .range(from, to)
      if (search) {
        query = query.ilike('name_fr', `%${search}%`)
      }
      if (group) {
        query = query.eq('group_fr', group)
      }
      const { data, error } = await query
      if (!mounted) return
      if (error) {
        setError(error.message)
      } else {
        setFoods(data as FoodClean[])
      }
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [search, group, page, limit])

  return { foods, loading, error }
}
