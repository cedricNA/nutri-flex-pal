import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { weightService } from '@/services/supabaseServices';
import { useToast } from '@/hooks/use-toast';
import type { WeightEntry } from '@/schemas';

const WeightEntrySection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [suggestion, setSuggestion] = useState<string>('');

  const loadEntries = async () => {
    if (!user) return;
    const data = await weightService.getWeightEntries(user.id);
    setEntries(data);
  };

  useEffect(() => {
    loadEntries();
  }, [user]);

  useEffect(() => {
    if (entries.length > 0) {
      const last = entries[entries.length - 1];
      setSuggestion(last.weight.toString());
    }
  }, [entries]);

  const handleAdd = async () => {
    if (!user || !weight) return;
    setLoading(true);
    try {
      await weightService.addWeightEntry(user.id, parseFloat(weight));
      await loadEntries();
      setWeight('');
      toast({ title: 'Poids enregistré' });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible d'enregistrer le poids.",
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card id="weight-entry">
      <CardHeader>
        <CardTitle>Saisie du poids</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="number"
            placeholder={suggestion ? `Dernier: ${suggestion}` : 'kg'}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAdd} disabled={loading || !weight}>
            Ajouter
          </Button>
        </div>
        {entries.length > 0 && (
          <ul className="text-sm space-y-1">
            {entries.slice(-5).reverse().map((e) => (
              <li key={e.id} className="flex justify-between">
                <span>{new Date(e.date).toLocaleDateString('fr-FR')}</span>
                <span>{e.weight} kg</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default WeightEntrySection;
