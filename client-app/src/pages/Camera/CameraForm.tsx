import { Modal, Form, Input } from "antd";
import CancelButton from "../../components/buttons/CancelButton";
import SaveButton from "../../components/buttons/SaveButton";
import { CustomFormProps, Camera } from "../../types";

export default function CameraForm({ visible, isEditing, onCancel, onOk, errors, form }: CustomFormProps<Camera>) {
  return (
    <Modal
      width={450}
      title={isEditing ? "Edit Kamera" : "Tambah Kamera"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <CancelButton label="Cancel" onCancel={onCancel} key='back' />,
        <SaveButton label={isEditing ? "Update" : "Create"} key='submit' />,
      ]}
    >
      <Form
        id="form"
        form={form}
        variant="filled"
        onFinish={onOk}
        requiredMark={false}
        labelCol={{ span: 6 }}
        labelAlign="left"
        colon={false}
        style={{ marginTop: 24 }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="Name"
          name="name"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.join(", ")}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="URL"
          name="url"
          validateStatus={errors.url ? "error" : ""}
          help={errors.url?.join(", ")}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="User"
          name="user"
          validateStatus={errors.user ? "error" : ""}
          help={errors.user?.join(", ")}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.join(", ")}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal >
  );
};
