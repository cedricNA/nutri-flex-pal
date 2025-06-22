import { useMemo } from 'react';

export interface ProgressSummary {
  weightChange: number;
  caloriesAverage: number;
}

export function useRecommendations(summary: ProgressSummary) {
  return useMemo(() => {
    const messages: string[] = [];
    if (summary.weightChange < -2) {
      messages.push("Votre poids diminue rapidement, envisagez d'augmenter légèrement votre apport calorique.");
    } else if (summary.weightChange > 2) {
      messages.push("Votre poids augmente rapidement, augmentez votre activité ou réduisez l'apport calorique.");
    }
    if (summary.caloriesAverage > 2500) {
      messages.push('Essayez de réduire votre apport calorique moyen.');
    }
    if (messages.length === 0) messages.push('Continuez ainsi, vos progrès sont constants !');
    return messages;
  }, [summary]);
}
