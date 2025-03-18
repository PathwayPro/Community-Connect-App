import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  CartesianGrid
} from 'recharts';

interface ChartCardProps {
  data: Array<{
    month: string;
    value: number;
  }>;
  title?: string;
  currentValue?: number;
  height?: number;
}

export const ChartCard = ({
  data,
  title,
  currentValue,
  height = 230
}: ChartCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="relative">
        {title && (
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        )}
        {currentValue && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-full bg-primary-200 px-3 py-1">
              <span className="text-sm font-medium text-white">
                {currentValue}
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--secondary))"
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--secondary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={true}
              horizontal={false}
              strokeDasharray="3 3"
              stroke="hsl(var(--neutral-light-300))"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              dy={10}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="text-sm font-medium">
                        {payload[0].value}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--secondary))"
              strokeWidth={2}
              fill="url(#gradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
