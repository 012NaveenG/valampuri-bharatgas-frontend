import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Define types for the response from the backend
interface MonthlySales {
  month: string; // The month in the format "YYYY-MM"
  total_amount_received: number;
  bal_payment: number;
}

// Define types for the chart data format
interface ChartData {
  month: string; // Month name (e.g., "January")
  desktop: number; // The total sales amount for the month
}

// The `AreaGraph` component receives `monthlySales` as a prop
interface AreaGraphProps {
  monthlySales: MonthlySales[];
}

const AreaGraph: React.FC<AreaGraphProps> = ({ monthlySales }) => {
  // Map the response data to the chartData format
  const chartData: ChartData[] = monthlySales.map((entry) => {
    const date = new Date(entry.month);
    const monthName = date.toLocaleString('default', { month: 'long' }); // e.g., "January"
    return {
      month: monthName,
      desktop: entry.total_amount_received, // Map the sales total to 'desktop'
    };
  });

  const chartConfig: ChartConfig = {
    desktop: {
      label: "Total Amt --",
      color: "hsl(var(--chart-1))",
    },
  };

  const currentYear = new Date().getFullYear();

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Sales - {currentYear}</CardTitle>

      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)} // Display first 3 letters of month
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AreaGraph;
