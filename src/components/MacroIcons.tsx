import React from 'react'
import { Fish, Pill, Droplet } from 'lucide-react'

interface MacroData {
  current: number
  target: number
}

interface MacroIconsProps {
  proteins: MacroData
  carbs: MacroData
  fats: MacroData
}

const MacroIcons = ({ proteins, carbs, fats }: MacroIconsProps) => {
  const macros = [
    { label: 'Protéines', data: proteins, Icon: Fish },
    { label: 'Glucides', data: carbs, Icon: Pill },
    { label: 'Lipides', data: fats, Icon: Droplet }
  ]

  return (
    <div className="flex justify-around">
      {macros.map(({ label, data, Icon }) => {
        const percentage = data.target > 0 ? Math.round((data.current / data.target) * 100) : 0
        return (
          <div key={label} className="flex flex-col items-center space-y-1">
 pcdz19-codex/créer-composant-macronutriments
            <div className="w-16 h-16 rounded-full border-2 border-gray-500/40 flex items-center justify-center">
              <Icon size={28} className="text-gray-400" />

            </div>
            <span className="text-sm font-semibold text-white">{label}</span>
            <span className="text-xs text-gray-400">{percentage}%</span>
          </div>
        )
      })}
    </div>
  )
}

export default MacroIcons
