'use client';

import { useEffect, useState } from "react";
import { Chart } from "@/components/charts/chart";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import SelectZone from "@/components/select-zone";
import { ChartData, SensorData } from "@/lib/types";
import { useParams } from "next/navigation";
import { sensorData as localSensorData } from "@/lib/data";

/*async function fetchSensorData(punto: string): Promise<SensorData[]> {
  try {
    const res = await fetch(
      `https://control-node-red.onrender.com/get-day-data?Punto_de_Muestreo=${encodeURIComponent(punto)}`,
      `http://localhost:1880/get-data?Punto_de_Muestreo=${punto}`,
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

const zonas: { [key: string]: string } = {
  "zona calvario quillacollo": "1",
  "zona la maica": "2",
  "puente killman": "3",
  "puente cobija": "4",
  "puente siles": "5",
};

async function fetchSensorData(punto: string): Promise<SensorData[]> {
  try {
    const puntoDecodificado = decodeURIComponent(punto);

    const idZona = zonas[puntoDecodificado];

    if (!idZona) {
      console.warn(`Zona no encontrada para: ${puntoDecodificado}`);
      return [];
    }

    const filteredData = localSensorData.filter(d => d.id_zona === idZona);
    return filteredData;
  } catch (error) {
    console.error("Error al filtrar los datos:", error);
    return [];
  }
}


export default function Page() {
  const params = useParams();
  console.log("Params completos:", params);
  const point = params.point || params.punto || ""; 

  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Valor de point:", point);
    if (point) {
      fetchSensorData(point as string).then((data) => {
        console.log("Datos filtrados:", data);
        setSensorData(data);
        setLoading(false);
      });
    }
  }, [point]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const chartData: ChartData[] = sensorData.map((data) => ({
    date: data.date,
    temperature: data.temperature,
    ph: data.ph,
    conductivity: data.conductivity,
    turbidity: data.turbidity ?? undefined,
    temp_amb: data.temp_amb,
  }));

  return (
    <div className="m-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl sm:text-5xl font-bold text-cyan-900">
            {decodeURIComponent(point as string).replace(/\b\w/g, (char) =>
              char.toUpperCase()
            )}
          </h1>
          <SelectZone />
        </div>
        <Link href="/">
          <Button className="bg-red-700 hover:bg-red-500 hover:cursor-pointer">
            Salir
          </Button>
        </Link>
      </div>
      <Chart chartData={chartData} />
      <h1 className="text-2xl font-bold text-cyan-900 mt-4">Tabla de datos</h1>
      <DataTable columns={columns} data={sensorData} />
    </div>
  );
}
