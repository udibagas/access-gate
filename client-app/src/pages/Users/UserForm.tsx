import { Modal, Form, Input, Select } from "antd";
import CancelButton from "../../components/buttons/CancelButton";
import SaveButton from "../../components/buttons/SaveButton";
import { CustomFormProps, UserType } from "../../types";

export default function UserForm({ visible, isEditing, onCancel, onOk, errors, form }: CustomFormProps<UserType>) {
  return (
    <Modal
      width={450}
      title={isEditing ? "Edit User" : "Create New User"}
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
          label="Email"
          name="email"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.join(", ")}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          validateStatus={errors.role ? "error" : ""}
          help={errors.role?.join(", ")}
        >
          <Select>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="user">User</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.join(", ")}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal >
  );
};
