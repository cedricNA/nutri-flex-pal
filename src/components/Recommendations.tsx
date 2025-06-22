import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  messages: string[];
}

export default function Recommendations({ messages }: Props) {
  return (
    <Card aria-label="Recommandations" className="bg-muted/50">
      <CardHeader>
        <CardTitle>Recommandations</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
