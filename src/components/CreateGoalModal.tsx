
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { dynamicDataService, type GoalType } from '@/services/dynamicDataService';
import { useToast } from '@/hooks/use-toast';

interface CreateGoalModalProps {
  onClose: () => void;
  onGoalCreated: () => void;
}

const CreateGoalModal = ({ onClose, onGoalCreated }: CreateGoalModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const goalTemplates = {
    weight_loss: {
      label: 'Perte de poids',
      unit: 'kg',
      goal_type: 'weight_loss' as GoalType,
      description: "Objectif de perte de poids progressif"
    },
    hydration: {
      label: 'Hydratation',
      unit: 'L',
      goal_type: 'hydration' as GoalType,
      description: "Boire suffisamment d'eau chaque jour"
    },
    activity: {
      label: 'Activité',
      unit: 'séances',
      goal_type: 'exercise' as GoalType,
      description: "Augmenter le nombre de séances d'activité physique"
    },
    maintenance: {
      label: 'Maintien',
      unit: 'kg',
      goal_type: 'nutrition' as GoalType,
      description: "Maintenir votre poids actuel"
    }
  } as const;

  const [selectedTemplate, setSelectedTemplate] =
    useState<keyof typeof goalTemplates | ''>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_value: 0,
    current_value: 0,
    unit: '',
    goal_type: 'custom' as const,
    deadline: ''
  });

  const handleTemplateChange = (value: keyof typeof goalTemplates) => {
    const template = goalTemplates[value];
    setSelectedTemplate(value);
    if (!template) return;
    setFormData({
      ...formData,
      unit: template.unit,
      goal_type: template.goal_type,
      description: template.description
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await dynamicDataService.createUserGoal(user.id, {
        ...formData,
        is_active: true
      });
      
      toast({
        title: "Objectif créé",
        description: "Votre nouvel objectif a été créé avec succès."
      });
      
      onGoalCreated();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'objectif.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouvel objectif</DialogTitle>
          <DialogDescription>
            Définissez un objectif personnalisé pour suivre vos progrès.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'objectif</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Perdre 5 kg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez votre objectif en détail..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Modèle d'objectif</Label>
            <Select
              value={selectedTemplate}
              onValueChange={(value) => handleTemplateChange(value as keyof typeof goalTemplates)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisissez un modèle" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(goalTemplates) as Array<keyof typeof goalTemplates>).map((key) => (
                  <SelectItem key={key} value={key}>
                    {goalTemplates[key].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_value">Objectif cible</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    id="target_value"
                    type="number"
                    value={formData.target_value}
                    onChange={(e) => setFormData({ ...formData, target_value: parseFloat(e.target.value) || 0 })}
                    placeholder="10"
                    required
                    min="0"
                    step="0.1"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  Valeur que vous souhaitez atteindre
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unité</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="kg, L, séances..."
                    required
                  />
                </TooltipTrigger>
                <TooltipContent>
                  Spécifiez l'unité de mesure
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_value">Valeur actuelle</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Input
                  id="current_value"
                  type="number"
                  value={formData.current_value}
                  onChange={(e) => setFormData({ ...formData, current_value: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </TooltipTrigger>
              <TooltipContent>
                Valeur actuelle de votre progression
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal_type">Type d'objectif</Label>
            <Select value={formData.goal_type} onValueChange={(value) => setFormData({ ...formData, goal_type: value as GoalType })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight_loss">Perte de poids</SelectItem>
                <SelectItem value="hydration">Hydratation</SelectItem>
                <SelectItem value="exercise">Exercice</SelectItem>
                <SelectItem value="calorie_deficit">Déficit calorique</SelectItem>
                <SelectItem value="sleep">Sommeil</SelectItem>
                <SelectItem value="nutrition">Nutrition</SelectItem>
                <SelectItem value="custom">Personnalisé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Échéance (optionnel)</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer l\'objectif'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGoalModal;
