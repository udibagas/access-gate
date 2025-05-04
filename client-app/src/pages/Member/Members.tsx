import { Member } from "../../types";
import MemberTable from "./MemberTable";
import { DataTableProvider } from "../../providers/DataTableProvider";

export default function Members() {
  return (
    <DataTableProvider<Member> url='/api/members' paginated={true}>
      <MemberTable />
    </DataTableProvider>
  );
};
