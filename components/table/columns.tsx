"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { SensorData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
// Añade este tipo en tu archivo
import { FilterFn } from "@tanstack/react-table";

// Define el tipo de filtro personalizado
declare module "@tanstack/react-table" {
  interface FilterFns {
    dateRange: FilterFn<unknown>;
  }
}

async function updateSensorData(updatedData: SensorData): Promise<boolean> {
  try {
    const res = await fetch(`https://control-node-red.onrender.com/update-data`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
      throw new Error("Error al actualizar el dato en Node-RED");
    }

    return true;
  } catch (error) {
    console.error("Error al actualizar:", error);
    return false;
  }
}





async function deleteSensorData(id: string, puntoDeMuestreo: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://control-node-red.onrender.com/delete-data?id=${encodeURIComponent(id)}&Punto_de_Muestreo=${encodeURIComponent(puntoDeMuestreo)}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      throw new Error("Error al eliminar el dato en Node-RED");
    }

    return true;
  } catch (error) {
    console.error("Error al eliminar:", error);
    return false;
  }
}

const ActionsCell: React.FC<{ data: SensorData }> = ({ data }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const currentPoint = params.point ? decodeURIComponent(params.point as string) : "";
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog Editar */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar registro</DialogTitle>
            <DialogDescription>
              Modifica los campos del registro {data.id}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-5 sm:grid-cols-8 items-center gap-2">
              <Label htmlFor="date" className="col-span-1 sm:col-span-2">
                Fecha y hora
              </Label>
              <Input
                id="date"
                type="date"
                defaultValue={data.date.split("T")[0]}
                className="col-span-2 sm:col-span-3"
              />
              <Input
                type="time"
                id="time"
                defaultValue={data.date.split("T")[1].slice(0, 5)}
                className="col-span-2 sm:col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="temp_amb">Temperatura ambiente</Label>
              <Input
                id="temp_amb"
                type="number"
                className="col-span-1"
                defaultValue={data.temp_amb}
              />
              <Label htmlFor="temp">Temperatura</Label>
              <Input
                id="temp"
                type="number"
                className="col-span-1"
                defaultValue={data.temperature}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="oxygen">Oxígeno</Label>
              <Input
                id="oxygen"
                type="number"
                className="col-span-1"
                defaultValue={data.oxygen}
              />
              <Label htmlFor="ph">pH</Label>
              <Input
                id="ph"
                type="number"
                className="col-span-1"
                defaultValue={data.ph}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="conductivity">Conductivi- dad</Label>
              <Input
                id="conductivity"
                type="number"
                className="col-span-1"
                defaultValue={data.conductivity}
              />
              <Label htmlFor="turbidity">Turbidez</Label>
              <Input
                id="turbidity"
                type="number"
                className="col-span-1"
                defaultValue={data.turbidity}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="solid">Sólidos totales</Label>
              <Input
                id="solid"
                type="number"
                className="col-span-1"
                defaultValue={data.solid}
              />
              <Label htmlFor="dbo5">DBO5</Label>
              <Input
                id="dbo5"
                type="number"
                className="col-span-1"
                defaultValue={data.dbo5}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nitrogen">Nitrógeno</Label>
              <Input
                id="nitrogen"
                type="number"
                className="col-span-1"
                defaultValue={data.nitrogen}
              />
              <Label htmlFor="phosphorus">Fósforo</Label>
              <Input
                id="phosphorus"
                type="number"
                className="col-span-1"
                defaultValue={data.phosphorus}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row">
            <Label htmlFor="pass">Contraseña:</Label>
            <Input type="password" id="pass" />
            <Button
              type="button"
              disabled={loading}
              onClick={async () => {
                const password = (
                  document.getElementById("pass") as HTMLInputElement
                ).value;
                if (password !== "12345") {    //boton editar
                  alert("Contraseña incorrecta");
                  return;
                }
                // Obtén la fecha y hora del formulario
                const date = (
                  document.getElementById("date") as HTMLInputElement
                ).value;
                const time = (
                  document.getElementById("time") as HTMLInputElement
                ).value;
                // Combina fecha y hora en el formato "YYYY-MM-DDTHH:mm:ss"
                const dateTime = `${date}T${time}:00`;

                const updatedData: SensorData = {
                  ...data,
                  date: dateTime,
                  temp_amb: parseFloat(
                    (document.getElementById("temp_amb") as HTMLInputElement)
                      .value
                  ),
                  temperature: parseFloat(
                    (document.getElementById("temp") as HTMLInputElement).value
                  ),
                  oxygen: parseFloat(
                    (document.getElementById("oxygen") as HTMLInputElement)
                      .value
                  ),
                  ph: parseFloat(
                    (document.getElementById("ph") as HTMLInputElement).value
                  ),
                  conductivity: parseFloat(
                    (
                      document.getElementById(
                        "conductivity"
                      ) as HTMLInputElement
                    ).value
                  ),
                  turbidity: parseFloat(
                    (document.getElementById("turbidity") as HTMLInputElement)
                      .value
                  ),
                  solid: parseFloat(
                    (document.getElementById("solid") as HTMLInputElement).value
                  ),
                  dbo5: parseFloat(
                    (document.getElementById("dbo5") as HTMLInputElement).value
                  ),
                  nitrogen: parseFloat(
                    (document.getElementById("nitrogen") as HTMLInputElement)
                      .value
                  ),
                  phosphorus: parseFloat(
                    (document.getElementById("phosphorus") as HTMLInputElement)
                      .value
                  ),
                  id:data.id,
                  Punto_de_Muestreo:currentPoint,
                };
                setLoading(true);
                const success = await updateSensorData(updatedData);
                setLoading(false);
                if (success) {
                  setOpenEdit(false);
                  router.refresh();
                } else {
                  alert("Error al actualizar");
                }
              }}
            >
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Eliminar */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar registro</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de eliminar el registro con ID: {data.id}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row">
            <Label htmlFor="pass">Contraseña:</Label>
            <Input type="password" id="pass" />
            <Button
              variant="destructive"
              disabled={loading}
              onClick={async () => {
                const password = (
                  document.getElementById("pass") as HTMLInputElement
                ).value;
                if (password !== "12345") {   //boton eliminar
                  alert("Contraseña incorrecta");
                  return;
                }
                setLoading(true);
                const success = await deleteSensorData(data.id, currentPoint);
                setLoading(false);
                if (success) {
                  setOpenDelete(false);
                  router.refresh();
                } else {
                  alert("Error al eliminar");
                }
              }}
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </Button>

            <Button variant="ghost" onClick={() => setOpenDelete(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export const columns: ColumnDef<SensorData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return date.toLocaleDateString("es-BO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
    filterFn: "dateRange" as const,
  },
  {
    accessorKey: "time",
    header: "Hora",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return date.toLocaleTimeString("es-BO", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    accessorKey: "temp_amb",
    header: "Temperatura ambiente",
  },
  {
    accessorKey: "temperature",
    header: "Temperatura",
  },
  {
    accessorKey: "oxygen",
    header: "Oxígeno D",
  },
  {
    accessorKey: "ph",
    header: "pH",
  },
  {
    accessorKey: "conductivity",
    header: "Conductividad",
  },
  {
    accessorKey: "turbidity",
    header: "Turbidez",
  },
  {
    accessorKey: "solid",
    header: "Sólidos totales",
  },
  {
    accessorKey: "dbo5",
    header: "DBO5",
  },
  {
    accessorKey: "nitrogen",
    header: "Nitrógeno",
  },
  {
    accessorKey: "phosphorus",
    header: "Fósforo",
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell data={row.original} />,
  },
];
