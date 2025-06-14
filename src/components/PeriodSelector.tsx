
import React from "react";
import { Button } from "@/components/ui/button";

type Period = "7d" | "30d" | "custom";

interface PeriodSelectorProps {
  period: Period;
  setPeriod: (p: Period) => void;
  disabled?: boolean;
}

const periods = [
  { label: "7 jours", value: "7d" },
  { label: "30 jours", value: "30d" },
  { label: "Personnalisé", value: "custom" },
];

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ period, setPeriod, disabled }) => {
  return (
    <div className="flex gap-2 mb-4">
      {periods.map(({ label, value }) => (
        <Button
          key={value}
          variant={period === value ? "default" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => setPeriod(value as Period)}
          disabled={disabled}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default PeriodSelector;
