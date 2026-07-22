import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { HistoryPoint } from "../../types/domain";
import { formatChartTime } from "../../lib/format";

interface HistoryChartProps {
  data: HistoryPoint[];
  dataKey: keyof HistoryPoint;
  color: string;
  unit: string;
  height?: number;
}

export function HistoryChart({ data, dataKey, color, unit, height = 220 }: HistoryChartProps) {
  const gradientId = `gradient-${dataKey}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-border)" vertical={false} />
        <XAxis
          dataKey="timestamp"
          tickFormatter={formatChartTime}
          stroke="var(--color-ink-faint)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          minTickGap={40}
        />
        <YAxis stroke="var(--color-ink-faint)" fontSize={11} tickLine={false} axisLine={false} width={40} />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-base-raised)",
            border: "1px solid var(--color-base-border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelFormatter={(value) => formatChartTime(String(value))}
          formatter={(value: number) => [`${value.toFixed(1)} ${unit}`, ""]}
        />
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
