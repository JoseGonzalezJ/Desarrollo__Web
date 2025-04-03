// src/ui/components/MetricCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { getStatusColor, seaStormColors } from "../../utils/colors";
import { useEffect, useState, useRef } from "react";
import { Thresholds } from "../../domain/models/Sensor";

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  thresholds?: Thresholds; // Asegúrate de que thresholds sea opcional
}

export function MetricCard({ title, value, unit, thresholds }: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [change, setChange] = useState(0);
  const [status, setStatus] = useState<"optimal" | "warning" | "critical">("optimal");
  const valueHistory = useRef<number[]>([]);
  const lastUpdateTime = useRef(Date.now());

  useEffect(() => {
    if (!thresholds) {
      setStatus("optimal"); // Si thresholds es undefined, asumimos que el estado es "optimal"
      return;
    }

    const currentTime = Date.now();
    valueHistory.current.push(value);

    setDisplayValue(value);

    if (value < thresholds.critical.min || value > thresholds.critical.max) {
      setStatus("critical");
    } else if (value < thresholds.warning.min || value > thresholds.warning.max) {
      setStatus("warning");
    } else {
      setStatus("optimal");
    }

    if (currentTime - lastUpdateTime.current >= 120000) {
      const oldestValue = valueHistory.current[0];
      const changePercent = ((value - oldestValue) / oldestValue) * 100;
      setChange(changePercent);

      valueHistory.current = [value];
      lastUpdateTime.current = currentTime;
    }

    const twoMinutesAgo = currentTime - 120000;
    valueHistory.current = valueHistory.current.filter(
      (_, index) => twoMinutesAgo <= lastUpdateTime.current - (valueHistory.current.length - 1 - index) * 10000,
    );
  }, [value, thresholds]);

  const statusColor = getStatusColor(status);

  return (
    <Card
      className="shadow-lg transition-all duration-300 hover:shadow-xl"
      style={{ backgroundColor: seaStormColors.cardBg, borderColor: seaStormColors.sand.medium }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium" style={{ color: seaStormColors.blue.dark }}>
          {title}
        </CardTitle>
        <Badge variant="outline" style={{ backgroundColor: statusColor, color: seaStormColors.sand.light }}>
          {status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" style={{ color: seaStormColors.blue.dark }}>
          {displayValue.toFixed(2)}
          <span className="text-sm font-normal ml-1" style={{ color: seaStormColors.blue.medium }}>
            {unit}
          </span>
        </div>
        {!isNaN(change) && (
          <p className="text-xs mt-1" style={{ color: seaStormColors.blue.medium }}>
            {change > 0 ? (
              <ArrowUpIcon className="inline w-3 h-3 text-teal-600 mr-1" />
            ) : (
              <ArrowDownIcon className="inline w-3 h-3 text-red-500 mr-1" />
            )}
            <span>{Math.abs(change).toFixed(2)}% from last 2 minutes</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}