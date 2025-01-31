import { cn } from "@/lib/utils";
import { seaStormColors } from "../../utils/colors";
import * as React from "react";

interface SidebarIconProps {
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  onClick?: () => void;
  label: string;
  color: string;
}

export function SidebarIcon({ icon: Icon, isActive = false, onClick, label, color }: SidebarIconProps) {
  const buttonStyle = React.useMemo(() => ({
    backgroundColor: isActive ? color : seaStormColors.sand.medium,
    color: isActive ? seaStormColors.sand.light : seaStormColors.blue.dark,
  }), [isActive, color]);

  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "p-2 rounded-lg transition-all duration-300 relative group",
        isActive ? "transform scale-105 shadow-lg" : "hover:bg-white/50",
      )}
      style={buttonStyle}
    >
      <Icon className="w-6 h-6" />
      <span className="sr-only">{label}</span>

      <div
        className="absolute left-14 px-2 py-1 rounded hidden group-hover:block whitespace-nowrap transition-opacity duration-300"
        style={{
          backgroundColor: seaStormColors.blue.light,
          color: seaStormColors.sand.light,
        }}
      >
        {label}
      </div>
    </button>
  );
}