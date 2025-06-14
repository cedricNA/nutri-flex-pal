
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const WeightChart = () => {
  const weightData = [
    { date: '1 Jan', weight: 72.5 },
    { date: '8 Jan', weight: 72.2 },
    { date: '15 Jan', weight: 71.8 },
    { date: '22 Jan', weight: 71.5 },
    { date: '29 Jan', weight: 71.0 },
    { date: '5 Fév', weight: 70.8 },
    { date: '12 Fév', weight: 70.3 },
    { date: '19 Fév', weight: 70.0 },
  ];

  const chartConfig = {
    weight: {
      label: 'Poids (kg)',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution du poids</CardTitle>
        <CardDescription>
          Suivi de votre poids au fil du temps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightData}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                cursor={{ stroke: 'var(--color-weight)', strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="var(--color-weight)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-weight)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-weight)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default WeightChart;
