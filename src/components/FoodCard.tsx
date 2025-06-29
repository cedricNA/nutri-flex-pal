import type { FoodClean } from '@/types/supabase'

interface Props {
  food: FoodClean
}

const FoodCard = ({ food }: Props) => (
  <div className="rounded-lg border bg-white p-4 space-y-2">
    <h3 className="font-semibold">{food.name_fr}</h3>
    <p className="text-sm text-gray-500">{food.group_fr}</p>
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div className="text-center">
        <p className="font-bold text-orange-600">{food.kcal}</p>
        <p className="text-xs">kcal</p>
      </div>
      <div className="text-center">
        <p className="font-bold text-green-600">{food.protein_g}g</p>
        <p className="text-xs">protéines</p>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-1 text-xs text-gray-600">
      <div className="text-center">
        <p className="font-medium">{food.carb_g}g</p>
        <p>Glucides</p>
      </div>
      <div className="text-center">
        <p className="font-medium">{food.fat_g}g</p>
        <p>Lipides</p>
      </div>
      <div className="text-center">
        <p className="font-medium">{food.fiber_g}g</p>
        <p>Fibres</p>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-1 text-xs text-gray-600">
      <div className="text-center">
        <p className="font-medium">{food.sugars_g}g</p>
        <p>Sucres</p>
      </div>
      <div className="text-center">
        <p className="font-medium">{food.sat_fat_g}g</p>
        <p>AGS</p>
      </div>
      <div className="text-center">
        <p className="font-medium">{food.salt_g}g</p>
        <p>Sel</p>
      </div>
    </div>
  </div>
)

export default FoodCard
