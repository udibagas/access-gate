import { Gate } from "../../types";
import GateTable from "./GateTable";
import { DataTableProvider } from "../../providers/DataTableProvider";

export default function User() {
  return (
    <DataTableProvider<Gate> url='/api/gates'>
      <GateTable />
    </DataTableProvider>
  );
};
