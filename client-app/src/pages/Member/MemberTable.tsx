import { ReloadOutlined } from "@ant-design/icons";
import ActionButton from "../../components/buttons/ActionButton";
import AddButton from "../../components/buttons/AddButton";
import { Member } from "../../types";
import DataTable from "../../components/DataTable";
import PageHeader from "../../components/PageHeader";
import MemberForm from "./MemberForm";
import { useDataTableContext } from "../../hooks/useDataTable";
import moment from "moment";
import StatusTag from "../../components/StatusTag";
import { useCallback } from "react";
import dayjs from "dayjs";
import { Input } from "antd";

export default function MemberTable() {
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
    setCurrentPage,
    setSearch,
  } = useDataTableContext()

  const prepareEdit = useCallback((record: Member) => {
    return handleEdit(record, {
      expiryDate: record.expiryDate ? dayjs(record.expiryDate) : null,
    });
  }, [handleEdit]);

  const columns = [
    {
      title: "No.",
      width: 60,
      render: (_: string, __: Member, index: number) => (currentPage - 1) * 10 + index + 1,
    },
    { title: "Nama", dataIndex: "name", key: "name", width: 170 },
    {
      title: "Jenis Kelamin",
      width: 150,
      render: (_: string, record: Member) => record.gender === "M" ? "Laki - Laki" : "Perempuan"
    },
    { title: "No. KTP", dataIndex: "idNumber", key: "idNumber", width: 150 },
    { title: "Grup", dataIndex: "group", key: "group", width: 150 },
    { title: "No. HP", dataIndex: "phone", key: "phone", width: 150 },
    { title: "Nomor Kartu", dataIndex: "cardNumber", key: "cardNumber", width: 150 },
    { title: "Nomor Kendaraan", dataIndex: "vehicleNumber", key: "vehicleNumber", width: 150 },
    {
      title: "Tgl Kedaluarsa",
      width: 150,
      render: (_: string, record: Member) => moment(record.expiryDate).format("DD-MMM-YYYY")
    },
    {
      title: "Status",
      width: 100,
      align: 'center' as const,
      render: (_: string, record: Member) => <StatusTag status={record.status} />
    },
    {
      title: <ReloadOutlined onClick={refreshData} />,
      key: "action",
      align: "center" as const,
      width: 80,
      render: (_: string, record: Member) => (
        <ActionButton
          onEdit={() => prepareEdit(record)}
          onDelete={() => handleDelete(record.id)}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Kelola Member">
        <AddButton label="Buat Member Baru" onClick={handleAdd} />
        <Input.Search
          placeholder="Cari member"
          allowClear
          onSearch={(value) => {
            setCurrentPage(1)
            setSearch(value)
          }}
          style={{ width: 200 }}
        />
      </PageHeader>

      <DataTable<Member> columns={columns} paginated={true} />

      <MemberForm
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
