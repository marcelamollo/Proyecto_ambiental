"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

export default function SelectZone() {
  return (
    <Select
      onValueChange={(value) => {
        window.location.href = `/${encodeURIComponent(value.toLowerCase())}`;
      }}
    >
      <SelectTrigger className="mt-1 sm:mt-3 max-h-6 px-2 sm:max-h-7 hover:bg-cyan-100 hover:cursor-pointer" />
      <SelectContent>
        <SelectItem value="zona calvario quillacollo">
          Zona Calvario Quillacollo
        </SelectItem>
        <SelectItem value="zona la maica">Zona La Maica</SelectItem>
        <SelectItem value="puente killman">Puente Killman</SelectItem>
        <SelectItem value="puente cobija">Puente Cobija</SelectItem>
        <SelectItem value="puente siles">Puente Siles</SelectItem>
      </SelectContent>
    </Select>
  );
}
