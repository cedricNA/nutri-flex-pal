import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { UserGoal } from '@/services/dynamicDataService';

interface ObjectiveSummaryProps {
  goal: UserGoal;
  progress: number;
  children?: React.ReactNode;
}

const ObjectiveSummary = ({ goal, progress, children }: ObjectiveSummaryProps) => {
  const isCompleted = progress >= 100;

  return (
    <div className="space-y-3 p-4 border rounded-lg">
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <div className="flex items-center space-x-2">
            {isCompleted ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
            <h4 className="font-medium">{goal.title}</h4>
            <Badge variant={isCompleted ? 'default' : progress >= 80 ? 'secondary' : 'outline'}>
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
      <Progress value={progress} className={`h-2 ${isCompleted ? 'bg-green-100' : ''}`} />
    </div>
  );
};

export default ObjectiveSummary;
