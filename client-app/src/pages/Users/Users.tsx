import { UserType } from "../../types";
import UserTable from "./UserTable";
import { DataTableProvider } from "../../providers/DataTableProvider";

export default function User() {
  return (
    <DataTableProvider<UserType> url='/api/users'>
      <UserTable />
    </DataTableProvider>
  );
};
