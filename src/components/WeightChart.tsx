import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PeriodSelector from "./PeriodSelector";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface WeightChartProps {
  period: "7d" | "30d" | "custom";
}

const allWeightData = [
  { date: '1 Jan', weight: 72.5 },
  { date: '8 Jan', weight: 72.2 },
  { date: '15 Jan', weight: 71.8 },
  { date: '22 Jan', weight: 71.5 },
  { date: '29 Jan', weight: 71.0 },
  { date: '5 Fév', weight: 70.8 },
  { date: '12 Fév', weight: 70.3 },
  { date: '19 Fév', weight: 70.0 },
];

const WeightChart: React.FC<WeightChartProps> = ({ period }) => {
  // Filtre de période basique (à raffiner si vrai custom)
  let data;
  if (period === "7d") data = allWeightData.slice(-2); // 2 derniers points = ~7j (exemple)
  else if (period === "30d") data = allWeightData.slice(-5);
  else data = allWeightData;

  const chartConfig = {
    weight: { label: 'Poids (kg)', color: 'hsl(var(--primary))' }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution du poids</CardTitle>
        <CardDescription>Suivi de votre poids au fil du temps</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto"> {/* Scroll horizontal si mobile */}
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" minWidth={320} height={300}>
              <LineChart data={data}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="weight" stroke="var(--color-weight)" strokeWidth={2}
                  dot={{ fill: 'var(--color-weight)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'var(--color-weight)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightChart;
