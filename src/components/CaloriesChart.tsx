import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import PeriodSelector from "./PeriodSelector";

interface CaloriesChartProps {
  period: "7d" | "30d" | "custom";
}

const allCaloriesData = [
  { day: 'Lun', consumed: 1850, target: 1900 },
  { day: 'Mar', consumed: 1920, target: 1900 },
  { day: 'Mer', consumed: 1780, target: 1900 },
  { day: 'Jeu', consumed: 1950, target: 1900 },
  { day: 'Ven', consumed: 1820, target: 1900 },
  { day: 'Sam', consumed: 2100, target: 1900 },
  { day: 'Dim', consumed: 1750, target: 1900 },
];

const CaloriesChart: React.FC<CaloriesChartProps> = ({ period }) => {
  // Simulation : sur 7j prend les 7 derniers, sur 30d, le même jeu, custom = tout
  let data = allCaloriesData;
  if (period === "7d") data = allCaloriesData;
  else if (period === "30d") data = allCaloriesData; // Remplacez par de vraies données 30j si dispo
  else data = allCaloriesData;

  const chartConfig = {
    consumed: { label: 'Consommées', color: 'hsl(142, 76%, 36%)' },
    target: { label: 'Objectif', color: 'hsl(215, 28%, 60%)' },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calories journalières</CardTitle>
        <CardDescription>Comparaison entre calories consommées et objectif</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" minWidth={320} height={300}>
              <BarChart data={data} barCategoryGap="20%">
                <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="target" fill="var(--color-target)" radius={[4, 4, 0, 0]} opacity={0.6} />
                <Bar dataKey="consumed" fill="var(--color-consumed)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaloriesChart;
