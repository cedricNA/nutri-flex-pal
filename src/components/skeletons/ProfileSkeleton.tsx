import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProfileSkeleton: React.FC = () => (
  <div className="space-y-8">
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </CardContent>
    </Card>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1,2,3,4].map(i => (
            <div key={i}>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i}>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

export default ProfileSkeleton;
