"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { overviewChartData } from "@/lib/data";
import { MapPoint, ChartData } from "@/lib/types";
import { useEffect, useState } from "react";

const chartConfig = {
  ph: {
    label: "pH",
    color: "hsl(var(--chart-1))",
    unit: "",
  },
  temperature: {
    label: "T°",
    color: "red",
    unit: "°C",
  },
  conductivity: {
    label: "Con",
    color: "hsl(var(--chart-2))",
    unit: "µS/cm",
  },
  turbidity: {
    label: "Turb",
    color: "blue",
    unit: "NTU",
  },
  temp_amb: {
    label: "T° Amb",
    color: "orange",
    unit: "°C",
  },
} satisfies ChartConfig;

async function fetchSensorData(): Promise<ChartData[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(overviewChartData);
    }, 1000);
  });
}

/*async function fetchChartData(punto: string): Promise<ChartData[]> {
  try {
    const res = await fetch(
      `http://localhost:1880/get-day-data?Punto_de_Muestreo=${encodeURIComponent(
        punto
      )}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Error al obtener datos desde Node-RED");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error al hacer fetch de los datos:", error);
    return [];
  }
}*/

export function OverviewChart({ point }: { point: MapPoint }) {
  //const chartData = await fetchChartData(point);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSensorData();
      setChartData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle>Gráfico de {point.title}</CardTitle>
        <CardDescription>
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </CardDescription>
      </CardHeader>
      {!loading && (
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={(data) => `${data.time}`}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 2)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="ph"
                type="monotone"
                stroke="var(--color-ph)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="temperature"
                type="monotone"
                stroke="var(--color-temperature)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="conductivity"
                type="monotone"
                stroke="var(--color-conductivity)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="turbidity"
                type="monotone"
                stroke="var(--color-turbidity)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="temp_amb"
                type="monotone"
                stroke="var(--color-temp_amb)"
                strokeWidth={2}
                dot={false}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      )}
      {loading && (
        <CardContent className="flex justify-center items-center">
          <div className="animate-spin w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full my-8"></div>
        </CardContent>
      )}
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
             Visualización de los últimos 10 registros.
            </div>
            <Link
              href={`/${point.title.toLowerCase()}`}
              className="bg-cyan-900 hover:bg-cyan-700 font-bold py-2 px-4 rounded text-center"
            >
              <span className="text-white">Ver detalles</span>
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
