import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Brush } from 'recharts';
import { Loader2 } from 'lucide-react';
import ChartSkeleton from './skeletons/ChartSkeleton';
import { useAuth } from '@/hooks/useAuth';
import { weightService } from '@/services/supabaseServices';
import type { WeightEntry } from '@/schemas';

interface WeightChartProps {
  period: "7d" | "30d" | "custom";
}

const WeightChart: React.FC<WeightChartProps> = ({ period }) => {
  const { user } = useAuth();
  const [weightData, setWeightData] = useState<WeightEntry[]>([]);
  const [prevData, setPrevData] = useState<WeightEntry[]>([]);
  const [compare, setCompare] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeightData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const entries = await weightService.getWeightEntries(user.id);
        
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
            date: new Date(entry.date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short'
            }),
            weight: Number(entry.weight)
          }));

        setWeightData(filteredEntries);

        const prevCutoff = new Date(cutoffDate);
        prevCutoff.setDate(prevCutoff.getDate() - (period === '7d' ? 7 : period === '30d' ? 30 : 30));
        const prevEntries = entries
          .filter(e => new Date(e.date) >= prevCutoff && new Date(e.date) < cutoffDate)
          .map(entry => ({
            date: new Date(entry.date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short'
            }),
            weight: Number(entry.weight)
          }));
        setPrevData(prevEntries);
      } catch (error) {
        console.error('Error loading weight data:', error);
        setError('Impossible de charger les données');
      } finally {
        setLoading(false);
      }
    };

    loadWeightData();
  }, [user, period]);

  const chartConfig = {
    weight: { label: 'Poids (kg)', color: 'hsl(var(--primary))' },
    prev: { label: 'Période précédente', color: 'hsl(var(--muted-foreground))' }
  };

  if (loading && weightData.length === 0) {
    return <ChartSkeleton title="Évolution du poids" />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Évolution du poids</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center gap-4">
            <Loader2 className="animate-spin text-muted-foreground" />
            <Button onClick={() => setError(null)} variant="outline">Réessayer</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (weightData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Évolution du poids</CardTitle>
          <CardDescription>Aucune donnée disponible pour cette période</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Aucune donnée de poids trouvée</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution du poids</CardTitle>
        <CardDescription>Suivi de votre poids au fil du temps</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setCompare((c) => !c)} variant="outline" size="sm" className="mb-2">
          {compare ? 'Masquer comparaison' : 'Comparer'}
        </Button>
        <div className="relative overflow-x-auto">
          {loading && weightData.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
              <Loader2 className="animate-spin" />
            </div>
          )}
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" minWidth={320} height={300} role="img" aria-label="Graphique du poids">
              <LineChart data={weightData}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="var(--color-weight)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-weight)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'var(--color-weight)', strokeWidth: 2 }}
                />
                {compare && prevData.length > 0 && (
                  <Line
                    type="monotone"
                    dataKey="weight"
                    data={prevData}
                    stroke="var(--color-prev)"
                    strokeDasharray="3 3"
                  />
                )}
                <Brush dataKey="date" height={20} stroke="var(--color-weight)" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightChart;
