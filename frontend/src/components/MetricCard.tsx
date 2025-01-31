import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, seaStormColors } from "../utils/colors";

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  status: "optimal" | "warning" | "critical";
}

export function MetricCard({ title, value, unit, status }: MetricCardProps) {
  const statusColor = getStatusColor(status) ?? seaStormColors.sand.dark;
  const formattedValue = Number.isFinite(value) ? value.toFixed(2) : "N/A";

  return (
    <Card
      className="shadow-lg transition-all duration-300 hover:shadow-xl"
      style={{ backgroundColor: seaStormColors.cardBg, borderColor: seaStormColors.sand.medium }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium" style={{ color: seaStormColors.blue.dark }}>
          {title}
        </CardTitle>
        <Badge 
          style={{ backgroundColor: statusColor, color: seaStormColors.sand.light }} 
          aria-label={`Status: ${status}`}
        >
          {status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold flex items-baseline gap-x-1" style={{ color: seaStormColors.blue.dark }}>
          {formattedValue}
          <span className="text-sm font-normal" style={{ color: seaStormColors.blue.medium }}>
            {unit}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
