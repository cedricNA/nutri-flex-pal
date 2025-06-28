import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { UserGoal } from '@/services/dynamicDataService';

interface ObjectiveSummaryProps {
  goal: UserGoal;
  progress: number;
  children?: React.ReactNode;
}

const ObjectiveSummary = ({ goal, progress, children }: ObjectiveSummaryProps) => {
  const isCompleted = progress >= 100;
  const progressColor = progress >= 80 ? 'text-green-400' : 'text-orange-400';

  return (
    <div className="group space-y-3 p-4 border rounded-lg hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <div className="flex items-center space-x-2">
            {isCompleted ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
            <h4 className="font-medium transition-colors group-hover:text-primary">{goal.title}</h4>
            <Badge className={`bg-white/10 px-2 rounded-full ${progressColor} transition-colors group-hover:brightness-110`}>

              {progress}%
            </Badge>
          </div>
          {goal.description && (
            <p className="text-sm text-muted-foreground">{goal.description}</p>
          )}
          <div className="flex justify-between items-center text-sm">
            <span>
              {goal.current_value} / {goal.target_value} {goal.unit}
            </span>
            {goal.deadline && (
              <span className="text-muted-foreground">
                Échéance: {new Date(goal.deadline).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        {children && <div className="flex items-center space-x-2 ml-4">{children}</div>}
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden group-hover:brightness-110"

          style={{ width: `${Math.min(progress, 100)}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ObjectiveSummary;
