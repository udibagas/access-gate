import { Gate } from "../../types";
import GateTable from "./GateTable";
import { DataTableProvider } from "../../providers/DataTableProvider";
import { useState } from "react";

export default function Gates() {
  const [log, setLog] = useState<string[]>([
    'Ini nanti log dari server',
    'Ini nanti log dari server',
    'Ini nanti log dari server',
    'Ini nanti log dari server',
  ]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <DataTableProvider<Gate> url='/api/gates'>
          <GateTable />
        </DataTableProvider>
      </div>

      <div className="bg-slate-800 p-4 h-[calc(100vh-150px)] overflow-y-auto text-green-500 font-mono">
        {log.map((line: string, index: number) => (
          <div key={index} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};
