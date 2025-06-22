
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from '@/components/ui/breadcrumb';
import WeightChart from './WeightChart';
import CaloriesChart from './CaloriesChart';
import ProgressStats from './ProgressStats';
import GoalsProgress from './GoalsProgress';
import WeightEntrySection from './WeightEntrySection';
import ProgressHeaderSkeleton from './skeletons/ProgressHeaderSkeleton';
import { TrendingUp, TrendingDown, Target, Calendar } from 'lucide-react';
import PeriodSelector from "./PeriodSelector";
import { useAppStore } from '../stores/useAppStore';
import { useProgressStats } from '../hooks/useProgressStats';

const ProgressPage = () => {
  const { currentPeriod, setPeriod } = useAppStore();
  const progressData = useProgressStats();

  if (progressData.loading) {
    return (
      <div className="space-y-8">
        <ProgressHeaderSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumb className="hidden md:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Tableau de bord</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>Progression</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">Évolution du poids</CardTitle>
            {progressData.weightChange < 0 ? (
              <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-300">
              {progressData.weightChange > 0 ? '+' : ''}{progressData.weightChange.toFixed(1)} kg
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              {currentPeriod === '7d' ? 'Cette semaine' : currentPeriod === '30d' ? 'Ce mois-ci' : 'Période sélectionnée'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">Calories moyennes</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">{progressData.caloriesAverage}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">Par jour</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">Série active</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">{progressData.workoutStreak} jours</div>
            <p className="text-xs text-purple-600 dark:text-purple-400">Consécutifs</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-400">Score global</CardTitle>
            <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-300">{progressData.globalScore}%</div>
            <p className="text-xs text-orange-600 dark:text-orange-400">Performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Sélecteur de période */}
      <PeriodSelector period={currentPeriod} setPeriod={setPeriod} />

      {/* Progress Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="weight">Poids</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeightChart period={currentPeriod} />
            <CaloriesChart period={currentPeriod} />
          </div>
          <ProgressStats />
          <GoalsProgress />
        </TabsContent>

        <TabsContent value="weight" className="space-y-6">
          <WeightChart period={currentPeriod} />
          <Card>
            <CardHeader>
              <CardTitle>Analyse du poids</CardTitle>
              <CardDescription>Évolution détaillée de votre poids</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span className="font-medium">Évolution</span>
                  <span className="text-lg font-bold">
                    {progressData.weightChange > 0 ? '+' : ''}{progressData.weightChange.toFixed(1)} kg
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span className="font-medium">Objectifs atteints</span>
                  <span className="text-lg font-bold">{progressData.goalsAchieved}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="font-medium text-green-700 dark:text-green-400">Score global</span>
                  <span className="text-lg font-bold text-green-800 dark:text-green-300">{progressData.globalScore}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <WeightEntrySection />
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-6">
          <CaloriesChart period={currentPeriod} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Protéines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">-</div>
                <p className="text-sm text-muted-foreground">Données non disponibles</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Glucides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">-</div>
                <p className="text-sm text-muted-foreground">Données non disponibles</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lipides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">-</div>
                <p className="text-sm text-muted-foreground">Données non disponibles</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default ProgressPage;
