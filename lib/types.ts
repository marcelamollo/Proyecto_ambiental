export interface MapPoint {
  id: number;
  position: [number, number]; // [latitud, longitud]
  title: string;
  image: string;
}

export interface SensorData {
  id: string;
  id_zona: string;
  date: string;
  temp_amb: number;
  temperature: number;
  ph: number;
  conductivity: number;
  oxygen: number;
  turbidity: number | null;
  solid: number;
  dbo5: number;
  nitrogen: number;
  phosphorus: number;
  coliformes: number | null;
  Punto_de_Muestreo?: string;
}

export interface ChartData {
  date?: string;
  time?: string;
  ph: number;
  temperature: number;
  conductivity: number;
  turbidity?: number;
  temp_amb?: number;
}
