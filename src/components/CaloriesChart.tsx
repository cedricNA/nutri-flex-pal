
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Brush } from 'recharts';
import { Loader2 } from 'lucide-react';
import ChartSkeleton from './skeletons/ChartSkeleton';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { calorieService } from '@/services/supabaseServices';
import type { CalorieEntry } from '@/schemas';

interface CaloriesChartProps {
  period: "7d" | "30d" | "custom";
}

const CaloriesChart: React.FC<CaloriesChartProps> = ({ period }) => {
  const { user } = useAuth();
  const [caloriesData, setCaloriesData] = useState<CalorieEntry[]>([]);
  const [prevData, setPrevData] = useState<CalorieEntry[]>([]);
  const [compare, setCompare] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCaloriesData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const entries = await calorieService.getCalorieEntries(user.id);
        
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
            cutoffDate = new Date(0);
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

        const prevCutoff = new Date(cutoffDate);

        prevCutoff.setDate(prevCutoff.getDate() - (period === '7d' ? 7 : period === '30d' ? 30 : 30));
        const prevEntries = entries
          .filter(e => new Date(e.date) >= prevCutoff && new Date(e.date) < cutoffDate)
          .map(entry => ({
            day: new Date(entry.date).toLocaleDateString('fr-FR', {
              weekday: 'short'
            }),

            consumed: Number(entry.consumed),
            target: Number(entry.target)
          }));
        setPrevData(prevEntries);
      } catch (error) {
        console.error('Error loading calories data:', error);
        setError('Impossible de charger les données');
      } finally {
        setLoading(false);
      }
    };

    loadCaloriesData();
  }, [user, period]);

  const chartConfig = {
    consumed: { label: 'Consommées', color: 'hsl(142, 76%, 36%)' },
    target: { label: 'Objectif', color: 'hsl(215, 28%, 60%)' },
    prevC: { label: 'Consommées (préc.)', color: 'hsl(var(--muted-foreground))' },
    prevT: { label: 'Objectif (préc.)', color: 'hsl(var(--border))' },
  };

  if (loading && caloriesData.length === 0) {
    return <ChartSkeleton title="Calories journalières" />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Calories journalières</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>

          <div className="h-[300px] flex items-center justify-center">

            <Button onClick={() => setError(null)} variant="outline">Réessayer</Button>
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
        <Button onClick={() => setCompare((c) => !c)} variant="outline" size="sm" className="mb-2">
          {compare ? 'Masquer comparaison' : 'Comparer'}
        </Button>
        <div className="relative overflow-x-auto">
          {loading && caloriesData.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
              <Loader2 className="animate-spin" />
            </div>
          )}
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" minWidth={320} height={300} role="img" aria-label="Graphique des calories">
              <BarChart data={caloriesData} barCategoryGap="20%">
                <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="target" fill="var(--color-target)" radius={[4, 4, 0, 0]} opacity={0.6} />
                <Bar dataKey="consumed" fill="var(--color-consumed)" radius={[4, 4, 0, 0]} />
                {compare && prevData.length > 0 && (
                  <>
                    <Bar dataKey="target" data={prevData} fill="var(--color-prevT)" radius={[4,4,0,0]} opacity={0.3} />
                    <Bar dataKey="consumed" data={prevData} fill="var(--color-prevC)" radius={[4,4,0,0]} opacity={0.3} />
                  </>
                )}
                <Brush dataKey="day" height={20} stroke="var(--color-target)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaloriesChart;
