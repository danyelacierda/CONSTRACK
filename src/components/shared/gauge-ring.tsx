import React from "react";
import { cn } from "@/lib/utils";

interface GaugeRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  unit?: string;
  showValue?: boolean;
  colorVariant?: "default" | "good" | "warn" | "critical" | "auto";
  className?: string;
}

export function GaugeRing({
  value,
  max = 100,
  size = 56,
  strokeWidth = 5,
  label,
  unit = "%",
  showValue = true,
  colorVariant = "auto",
  className,
}: GaugeRingProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let strokeColor = "#f59e0b"; // default primary safety amber
  if (colorVariant === "good") strokeColor = "#10b981";
  else if (colorVariant === "warn") strokeColor = "#f59e0b";
  else if (colorVariant === "critical") strokeColor = "#ef4444";
  else if (colorVariant === "auto") {
    if (percentage > 50) strokeColor = "#10b981";
    else if (percentage > 20) strokeColor = "#f59e0b";
    else strokeColor = "#ef4444";
  }

  return (
    <div className={cn("inline-flex flex-col items-center justify-center", className)}>
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#222634"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="readout text-xs font-bold leading-none text-foreground">
              {Math.round(percentage)}
              <span className="text-[9px] font-normal text-muted-foreground">{unit}</span>
            </span>
          </div>
        )}
      </div>
      {label && (
        <span className="mt-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider text-center">
          {label}
        </span>
      )}
    </div>
  );
}
