
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Brush } from 'recharts';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { weightService } from '@/services/supabaseServices';
import type { WeightEntry } from '@/schemas';

interface WeightChartProps {
  period: "7d" | "30d" | "custom";
}

const WeightChart: React.FC<WeightChartProps> = ({ period }) => {
  const { user } = useAuth();
  const [weightData, setWeightData] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeightData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const entries = await weightService.getWeightEntries(user.id);
        
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
            date: new Date(entry.date).toLocaleDateString('fr-FR', { 
              day: 'numeric', 
              month: 'short' 
            }),
            weight: Number(entry.weight)
          }));

        setWeightData(filteredEntries);
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
    weight: { label: 'Poids (kg)', color: 'hsl(var(--primary))' }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Évolution du poids</CardTitle>
          <CardDescription>Chargement des données...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Évolution du poids</CardTitle>
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
        <div className="overflow-x-auto">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" minWidth={320} height={300}>
              <LineChart data={weightData}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="weight" stroke="var(--color-weight)" strokeWidth={2}
                  dot={{ fill: 'var(--color-weight)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'var(--color-weight)', strokeWidth: 2 }}
                />
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
