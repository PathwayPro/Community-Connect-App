import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Download } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Label
} from 'recharts';

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface PieChartCardProps {
  title?: string;
  total?: number;
  data: PieChartData[];
  showPercentage?: boolean;
  onDownload?: () => void;
}

export const PieChartCard = ({
  data,
  title = 'Total',
  total = 2000,
  showPercentage = true,
  onDownload
}: PieChartCardProps) => {
  const formattedData = data.map((item) => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(0)
  }));

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-end p-2">
        <CardTitle className="sr-only text-base font-medium">
          Statistics
        </CardTitle>
        {onDownload && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ResponsiveContainer className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <Pie
              data={formattedData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
              strokeWidth={2}
              stroke="#fff"
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          {title}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconSize={12}
              iconType="circle"
              formatter={(value: string, entry: any) => (
                <span className="text-sm">
                  {value}
                  {showPercentage && ` (${entry.payload.percentage}%)`}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
