
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { calorieService } from '@/services/supabaseServices';
import type { CalorieEntry } from '@/schemas';

interface CaloriesChartProps {
  period: "7d" | "30d" | "custom";
}

const CaloriesChart: React.FC<CaloriesChartProps> = ({ period }) => {
  const { user } = useAuth();
  const [caloriesData, setCaloriesData] = useState<CalorieEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCaloriesData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const entries = await calorieService.getCalorieEntries(user.id);
        
        // Filtrer selon la période
        const now = new Date();
        let cutoffDate = new Date();
        
        switch (period) {
          case '7d':
            cutoffDate.setDate(now.getDate() - 7);
            break;
          case '30d':
            cutoffDate.setDate(now.getDate() - 30);
            break;
          default:
            cutoffDate = new Date(0); // Toutes les données
        }

        const filteredEntries = entries
          .filter(entry => new Date(entry.date) >= cutoffDate)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map(entry => ({
            day: new Date(entry.date).toLocaleDateString('fr-FR', { 
              weekday: 'short'
            }),
            consumed: Number(entry.consumed),
            target: Number(entry.target)
          }));

        setCaloriesData(filteredEntries);
      } catch (error) {
        console.error('Error loading calories data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCaloriesData();
  }, [user, period]);

  const chartConfig = {
    consumed: { label: 'Consommées', color: 'hsl(142, 76%, 36%)' },
    target: { label: 'Objectif', color: 'hsl(215, 28%, 60%)' },
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Calories journalières</CardTitle>
          <CardDescription>Chargement des données...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (caloriesData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Calories journalières</CardTitle>
          <CardDescription>Aucune donnée disponible pour cette période</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Aucune donnée de calories trouvée</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              <BarChart data={caloriesData} barCategoryGap="20%">
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
