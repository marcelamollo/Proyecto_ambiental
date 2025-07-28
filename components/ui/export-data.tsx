'use client';

import { Button } from './button';
import * as XLSX from 'xlsx';
import { SensorData } from '@/lib/types';

type Props = {
  data: SensorData[];
};

const ExportExcel = ({ data }: Props) => {
  const exportar = () => {
    // Transformar los datos anidados a formato plano
    const datosPlanos = data.reverse().map((item) => ({
      Punto_de_muestreo: item.Punto_de_Muestreo,
      Id: item.id,
      FechayHora_timestampISO8601: item.date,
      Temperatura_agua: item.temperature,
      pH: item.ph,
      Turbidez: item.turbidity,
      Temp_ambiente: item.temp_amb,
      Conductividad: item.conductivity,
      Oxigeno_disuelto: item.oxygen,
      Solidos_disueltos: item.solid,
      DBO5: item.dbo5,
      Nitrógeno: item.nitrogen,
      Fósforo: item.phosphorus
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosPlanos);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const punto = data[0]?.Punto_de_Muestreo || 'PuntoDesconocido';
    const nombreArchivo = `Datos-${punto}.xlsx`;

    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={exportar}
      className="bg-green-700 hover:bg-green-500 hover:cursor-pointer"
    >
      Exportar
    </Button>
  );
};

export default ExportExcel;
