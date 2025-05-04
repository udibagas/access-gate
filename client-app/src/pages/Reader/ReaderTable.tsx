import { ReloadOutlined } from "@ant-design/icons";
import ActionButton from "../../components/buttons/ActionButton";
import AddButton from "../../components/buttons/AddButton";
import { Reader } from "../../types";
import DataTable from "../../components/DataTable";
import PageHeader from "../../components/PageHeader";
import ReaderForm from "./ReaderForm";
import { useDataTableContext } from "../../hooks/useDataTable";

export default function UserTable() {
  const {
    currentPage,
    showForm,
    isEditing,
    errors,
    form,
    handleModalClose,
    handleSubmit,
    refreshData,
    handleEdit,
    handleDelete,
    handleAdd,
  } = useDataTableContext()

  const columns = [
    {
      title: "No.",
      width: 60,
      render: (_: string, __: Reader, index: number) => (currentPage - 1) * 10 + index + 1,
    },
    { title: "Gate", width: 150, render: (_: string, record: Reader) => record.gate.name },
    { title: "Nama", dataIndex: "name", key: "name", width: 150 },
    { title: "Prefix", dataIndex: "prefix", key: "prefix", width: 150 },
    { title: "Jenis", dataIndex: "type", key: "type", width: 150 },
    { title: "Kamera", width: 150, render: (_: string, record: Reader) => record.cameras.map((camera) => camera.name).join(", ") },
    {
      title: <ReloadOutlined onClick={refreshData} />,
      key: "action",
      align: "center" as const,
      width: 80,
      render: (_: string, record: Reader) => (
        <ActionButton
          onEdit={() => handleEdit(record)}
          onDelete={() => handleDelete(record.id)}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Kelola Reader">
        <AddButton label="Buat Reader Baru" onClick={handleAdd} />
      </PageHeader>

      <DataTable<Reader> columns={columns} />

      <ReaderForm
        visible={showForm}
        isEditing={isEditing}
        errors={errors}
        form={form}
        onCancel={handleModalClose}
        onOk={handleSubmit}
      />
    </>
  )
}
