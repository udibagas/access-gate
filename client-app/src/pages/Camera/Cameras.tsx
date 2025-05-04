import { Camera } from "../../types";
import CameraTable from "./CameraTable";
import { DataTableProvider } from "../../providers/DataTableProvider";

export default function Cameras() {
  return (
    <DataTableProvider<Camera> url='/api/cameras'>
      <CameraTable />
    </DataTableProvider>
  );
};
