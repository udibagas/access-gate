import { Modal, Form, Input } from "antd";
import CancelButton from "../../components/buttons/CancelButton";
import SaveButton from "../../components/buttons/SaveButton";
import { CustomFormProps, Gate } from "../../types";

export default function GateForm({ visible, isEditing, onCancel, onOk, errors, form }: CustomFormProps<Gate>) {
  return (
    <Modal
      width={450}
      title={isEditing ? "Edit Gate" : "Create New Gate"}
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
        className="my-8"
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
          label="Device"
          name="device"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.join(", ")}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal >
  );
};
