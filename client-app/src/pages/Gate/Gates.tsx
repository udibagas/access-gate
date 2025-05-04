import { Gate } from "../../types";
import GateTable from "./GateTable";
import { DataTableProvider } from "../../providers/DataTableProvider";

export default function Gates() {
  return (
    <DataTableProvider<Gate> url='/api/gates'>
      <GateTable />
    </DataTableProvider>
  );
};
