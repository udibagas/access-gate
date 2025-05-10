import { ReloadOutlined } from "@ant-design/icons";
import ActionButton from "../../components/buttons/ActionButton";
import AddButton from "../../components/buttons/AddButton";
import { UserType } from "../../types";
import DataTable from "../../components/DataTable";
import PageHeader from "../../components/PageHeader";
import UserForm from "./UserForm";
import { Input } from "antd";
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
    setSearch,
    setCurrentPage,
  } = useDataTableContext()

  const columns = [
    {
      title: "No.",
      width: 60,
      render: (_: string, __: UserType, index: number) => (currentPage - 1) * 10 + index + 1,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: <ReloadOutlined onClick={refreshData} />,
      key: "action",
      align: "center" as const,
      width: 80,
      render: (_: string, record: UserType) => (
        <ActionButton
          onEdit={() => handleEdit(record)}
          onDelete={() => handleDelete(record.id)}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Kelola Users">
        <AddButton label="Tambah User User" onClick={handleAdd} />
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

      <DataTable<UserType> columns={columns} />

      <UserForm
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
