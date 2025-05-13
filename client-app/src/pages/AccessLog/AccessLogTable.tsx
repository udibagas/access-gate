import moment from "moment";
import { CameraFilled, ReloadOutlined } from "@ant-design/icons";
import DataTable from "../../components/DataTable";
import PageHeader from "../../components/PageHeader";
import { Image, Input, message, Modal } from "antd";
import { useDataTableContext } from "../../hooks/useDataTable";
import { AccessLogType } from "../../types";

export default function AccessLogTable() {
  const { refreshData, setSearch, setCurrentPage } = useDataTableContext()

  function showSnapshots(record: AccessLogType) {
    if (record.snapshots?.length === 0) {
      message.error("Tidak ada snapshot untuk log ini");
      return;
    }

    const { protocol, host } = window.location;

    Modal.info({
      icon: false,
      width: 900,
      title: 'Snapshot',
      content: (
        <div className="grid grid-cols-2 gap-4">
          {record.snapshots.map((snapshot, index) => {
            const imgSrc = `${protocol}//${host}/${snapshot.filepath}`;
            return (
              <div key={index}>
                <Image src={imgSrc} alt="Snapshot" />
              </div>
            )
          }
          )}
        </div>
      ),
    });
  }

  const columns = [
    {
      title: "Waktu", width: 160, dataIndex: "createdAt", key: "createdAt", render: (_: string, record: AccessLogType) => {
        const date = new Date(record.createdAt)
        const formattedDate = moment(date).format("DD-MMM-YYYY HH:mm:ss")
        return (<span>{formattedDate}</span>)
      }
    },
    {
      title: "Gate",
      width: 100,
      key: "gate.name",
      render: (_: string, record: AccessLogType) => record.gate.name,
    },
    { title: "Jenis", width: 100, dataIndex: "type", key: "type", },
    {
      title: "Nama",
      width: 150,
      key: "member.name",
      render: (_: string, record: AccessLogType) => record.member.name,
    },
    { title: "Nomor Kartu", width: 150, dataIndex: "cardNumber", key: "cardNumber", },
    { title: "Plat Nomor", width: 150, dataIndex: "vehicleNumber", key: "vehicleNumber", },
    {
      title: <ReloadOutlined onClick={refreshData} />,
      key: "action",
      align: "center" as const,
      width: 80,
      render: (_: string, record: AccessLogType) => (
        <CameraFilled onClick={() => showSnapshots(record)} />
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Access Logs">
        <Input.Search
          placeholder="Search"
          allowClear
          onSearch={(value) => {
            setCurrentPage(1)
            setSearch(value)
          }}
          style={{ width: 200 }}
        />
      </PageHeader>

      <DataTable<AccessLogType> columns={columns} paginated={true} />
    </>
  )
}