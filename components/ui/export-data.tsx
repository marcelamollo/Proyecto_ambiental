'use client';

import { Button } from './button';
import * as XLSX from 'xlsx';
import { sensorData } from '@/lib/data';

// Mapa inverso para obtener nombre desde id_zona
const zonasInv: { [key: string]: string } = {
  "1": "zona calvario quillacollo",
  "2": "zona la maica",
  "3": "puente killman",
  "4": "puente cobija",
  "5": "puente siles",
};

const ExportExcelAll = () => {
  const exportar = () => {
    const datosPlanos = sensorData.slice().sort((a, b) => Number(a.id) - Number(b.id)).map((item) => ({
      "ID": item.id,
      "ID Zona": item.id_zona,
      "Punto de Muestreo": zonasInv[item.id_zona] || "Zona desconocida",
      "Fecha y Hora [ISO 8601]": item.date,
      "Temperatura del Agua [°C]": item.temperature,
      "pH": item.ph,
      "Turbidez [NTU]": item.turbidity,
      "Temperatura Ambiente [°C]": item.temp_amb,
      "Conductividad [µS/cm]": item.conductivity,
      "Oxígeno Disuelto [mg/L]": item.oxygen,
      "Sólidos Disueltos Totales [mg/L]": item.solid,
      "DBO5 [mg/L]": item.dbo5,
      "Nitrógeno Total [mg/L]": item.nitrogen,
      "Fósforo Total [mg/L]": item.phosphorus,
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

    const nombreArchivo = 'Compilacion_datos_monitoreo_rio_Rocha.xlsx';

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

export default ExportExcelAll;
