
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const CaloriesChart = () => {
  const caloriesData = [
    { day: 'Lun', consumed: 1850, target: 1900 },
    { day: 'Mar', consumed: 1920, target: 1900 },
    { day: 'Mer', consumed: 1780, target: 1900 },
    { day: 'Jeu', consumed: 1950, target: 1900 },
    { day: 'Ven', consumed: 1820, target: 1900 },
    { day: 'Sam', consumed: 2100, target: 1900 },
    { day: 'Dim', consumed: 1750, target: 1900 },
  ];

  const chartConfig = {
    consumed: {
      label: 'Consommées',
      color: 'hsl(142, 76%, 36%)',
    },
    target: {
      label: 'Objectif',
      color: 'hsl(215, 28%, 60%)',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calories journalières</CardTitle>
        <CardDescription>
          Comparaison entre calories consommées et objectif
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={caloriesData} barCategoryGap="20%">
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="target"
                fill="var(--color-target)"
                radius={[4, 4, 0, 0]}
                opacity={0.6}
              />
              <Bar
                dataKey="consumed"
                fill="var(--color-consumed)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CaloriesChart;
