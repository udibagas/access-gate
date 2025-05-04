import { Reader } from "../../types";
import ReaderTable from "./ReaderTable";
import { DataTableProvider } from "../../providers/DataTableProvider";

export default function User() {
  return (
    <DataTableProvider<Reader> url='/api/readers'>
      <ReaderTable />
    </DataTableProvider>
  );
};
