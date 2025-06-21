import { differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns'
import { weightService, sleepService } from '@/services/supabaseServices'
import { supabase } from '@/integrations/supabase/client'
import type { UserGoal } from '@/services/dynamicDataService'

export async function calculateGoalProgress(goal: UserGoal): Promise<number> {
  if (!goal.start_date || !goal.end_date || !goal.tracking_interval || !goal.tracking_repetition) {
    if (goal.target_value === 0) return 0
    return Math.min(Math.round((goal.current_value / goal.target_value) * 100), 100)
  }

  const start = new Date(goal.start_date)
  const end = new Date(goal.end_date)
  let expected = 0
  switch (goal.tracking_interval) {
    case 'jour':
      expected = differenceInDays(end, start) + 1
      break
    case 'semaine':
      expected = differenceInWeeks(end, start) + 1
      break
    case 'mois':
      expected = differenceInMonths(end, start) + 1
      break
  }
  expected *= goal.tracking_repetition

  let actual = 0
  if (goal.goal_type === 'weight_loss') {
    const entries = await weightService.getWeightEntries(goal.user_id)
    actual = entries.filter(e => e.date >= goal.start_date! && e.date <= goal.end_date!).length
  } else if (goal.goal_type === 'hydration') {
    const { data } = await supabase
      .from('hydration_entries')
      .select('id, date')
      .eq('user_id', goal.user_id)
      .gte('date', goal.start_date)
      .lte('date', goal.end_date)
    actual = data ? data.length : 0
  } else if (goal.goal_type === 'sleep') {
    const entries = await sleepService.getSleepEntries(goal.user_id, new Date(goal.start_date), new Date(goal.end_date))
    actual = entries.length
  }

  if (expected === 0) return 0
  return Math.min(Math.round((actual / expected) * 100), 100)
}
