"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartData } from "@/lib/types";

const chartConfig = {
  ph: {
    label: "pH ",
    color: "hsl(var(--chart-2))",
  },
  temperature: {
    label: "T°",
    color: "red",
  },
  conductivity: {
    label: "Conductividad",
    color: "hsl(var(--chart-1))",
  },
  turbidity: {
    label: "Turbidez",
    color: "blue",
  },
  temp_amb: {
    label: "T° Amb.",
    color: "orange",
  },
} satisfies ChartConfig;

export function Chart({ chartData }: { chartData: ChartData[] }) {
  const [timeRange, setTimeRange] = React.useState("1d");
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("ph");

  // Filtrar datos en base al tiempo seleccionado
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date ?? "");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 31;
    } else if (timeRange === "7d") {
      daysToSubtract = 8;
    } else if (timeRange === "1d") {
      daysToSubtract = 1;
    } else if (timeRange === "all") {
      return true;
    } else if (timeRange === "365d") {
      daysToSubtract = 365;
    }
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  // Calcular el mayor valor de los datos para cada sensor
  const maxValues = React.useMemo(() => {
    const getMaxValue = (key: keyof ChartData) => {
      return filteredData.reduce(
        (max, curr) =>
          typeof curr[key] === "number" && curr[key] > max ? curr[key] : max,
        -Infinity
      );
    };
    return {
      ph: getMaxValue("ph"),
      temperature: getMaxValue("temperature"),
      conductivity: getMaxValue("conductivity"),
      turbidity: getMaxValue("turbidity"),
      temp_amb: getMaxValue("temp_amb"),
    };
  }, [filteredData]);

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-0 border-b sm:flex-row sm:items-center">
        <div className="grid flex-1 gap-1 text-left">
          <CardTitle>Datos de los sensores</CardTitle>
          <CardDescription>
            Mostrando resultados de los últimos{" "}
            {timeRange === "90d"
              ? "3 meses"
              : timeRange === "30d"
              ? "30 días"
              : timeRange === "1d"
              ? "1 día"
              : timeRange === "all"
              ? "todos los datos"
              : timeRange === "365d"
              ? "1 año"
              : "7 días"}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="mt-3 w-[160px] rounded-lg sm:mt-0 sm:ml-auto"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Hoy" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="rounded-lg">
              Todos los datos
            </SelectItem>
            <SelectItem value="365d" className="rounded-lg">
              Último año
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              Últimos 3 meses
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Últimos 30 días
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Últimos 7 días
            </SelectItem>
            <SelectItem value="1d" className="rounded-lg">
              Hoy
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <div className="flex flex-wrap border-b">
        {Object.keys(chartConfig).map((key) => {
          const chart = key as keyof typeof chartConfig;
          return (
            <button
              key={chart}
              data-active={activeChart === chart}
              className="flex flex-1 flex-col hover:cursor-pointer justify-center gap-1 border-r px-6 py-4 text-center last:border-r-0 data-[active=true]:bg-muted/50 sm:min-w-[120px] sm:py-5"
              onClick={() => setActiveChart(chart)}
            >
              <span className="text-xs text-muted-foreground sm:text-2xl">
                {chartConfig[chart].label}
              </span>
              <span className="text-lg font-bold leading-none sm:text-2xl">
                {maxValues[chart].toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>

      <CardContent className="pl-0 pt-4 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              {Object.keys(chartConfig).map((key) => (
                <linearGradient
                  key={`fill${key}`}
                  id={`fill${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("es-BO", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-BO", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {/* Solo mostrar el área chart activo */}
            <Area
              dataKey={activeChart}
              type="monotone"
              fill={`url(#fill${activeChart})`}
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
