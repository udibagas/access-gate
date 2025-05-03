import AccessLogTable from "./AccessLogTable";
import { DataTableProvider } from "../../providers/DataTableProvider";
import { AccessLogType } from "../../types";

export default function AccessLog() {
  return (
    <DataTableProvider<AccessLogType> url='/api/accessLogs' paginated={true}>
      <AccessLogTable />
    </DataTableProvider>
  );
};
