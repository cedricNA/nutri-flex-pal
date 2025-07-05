export const planColors = {
  maintenance: {
    card: 'bg-blue-600',
    badge: 'bg-blue-700',
    progress: 'bg-blue-500'
  },
  'weight-loss': {
    card: 'bg-pink-600',
    badge: 'bg-pink-700',
    progress: 'bg-pink-500'
  },
  bulk: {
    card: 'bg-green-600',
    badge: 'bg-green-700',
    progress: 'bg-green-500'
  }
} as const;

export type PlanType = keyof typeof planColors;
