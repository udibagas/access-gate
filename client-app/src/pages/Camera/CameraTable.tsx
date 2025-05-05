import { ReloadOutlined, CameraOutlined } from "@ant-design/icons";
import ActionButton from "../../components/buttons/ActionButton";
import AddButton from "../../components/buttons/AddButton";
import { Camera } from "../../types";
import DataTable from "../../components/DataTable";
import PageHeader from "../../components/PageHeader";
import CameraForm from "./CameraForm";
import { useDataTableContext } from "../../hooks/useDataTable";
import { Image, message, Modal } from "antd";
import { axiosInstance } from "../../lib/api";

export default function CameraTable() {
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
      render: (_: string, __: Camera, index: number) => (currentPage - 1) * 10 + index + 1,
    },
    { title: "Name", dataIndex: "name", key: "name", width: 150 },
    { title: "URL", dataIndex: "url", key: "url", minWidth: 200 },
    { title: "User", dataIndex: "user", key: "user", width: 120 },
    { title: "Password", dataIndex: "password", key: "password", width: 120 },
    {
      title: <ReloadOutlined onClick={refreshData} />,
      key: "action",
      align: "center" as const,
      width: 80,
      render: (_: string, record: Camera) => (
        <ActionButton
          onEdit={() => handleEdit(record)}
          onDelete={() => handleDelete(record.id)}
          additionalItems={[
            {
              key: "test",
              icon: <CameraOutlined />,
              label: "Test Kamera",
              onClick: () => testCamera(record),
            },
          ]}
        />
      ),
    },
  ];

  function testCamera(record: Camera) {
    axiosInstance.post(`/api/cameras/${record.id}/snapshot`)
      .then((response) => {
        console.log("Camera is reachable", response);
        Modal.info({
          title: record.name,
          content: <Image src={response.data} alt={record.name} />,
        });
      })
      .catch((error) => {
        message.error(`Error reaching camera. ${error.message}`);
      });
  }

  return (
    <>
      <PageHeader title="Kelola Kamera">
        <AddButton label="Buat Kamera Baru" onClick={handleAdd} />
      </PageHeader>

      <DataTable<Camera> columns={columns} />

      <CameraForm
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
