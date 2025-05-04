import { Modal, Form, Input, Select, Radio } from "antd";
import CancelButton from "../../components/buttons/CancelButton";
import SaveButton from "../../components/buttons/SaveButton";
import { Camera, CustomFormProps, Gate, Reader } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { getItems } from "../../lib/api";

export default function ReaderForm({ visible, isEditing, onCancel, onOk, errors, form }: CustomFormProps<Reader>) {

  const { data: gates = [] } = useQuery({
    queryKey: ["gates"],
    queryFn: () => getItems<Gate[]>('/api/gates'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const { data: cameras = [] } = useQuery({
    queryKey: ["cameras"],
    queryFn: () => getItems<Camera[]>('/api/cameras'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return (
    <Modal
      width={450}
      title={isEditing ? "Edit Reader" : "Buat Reader Baru"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <CancelButton label="Batal" onCancel={onCancel} key='back' />,
        <SaveButton label='Simpan' key='submit' />,
      ]}
    >
      <Form
        id="form"
        form={form}
        variant="filled"
        onFinish={onOk}
        requiredMark={false}
        labelCol={{ span: 7 }}
        labelAlign="left"
        colon={false}
        style={{ marginTop: 24 }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="Gate"
          name="GateId"
          validateStatus={errors.GateId ? "error" : ""}
          help={errors.GateId?.join(", ")}
        >
          <Select placeholder="Pilih Gate" allowClear>
            {gates.map((gate) => (
              <Select.Option key={gate.id} value={gate.id}>
                {gate.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Nama Reader"
          name="name"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.join(", ")}
        >
          <Input placeholder="Nama Reader" allowClear />
        </Form.Item>

        <Form.Item
          label="Prefix"
          name="prefix"
          validateStatus={errors.prefix ? "error" : ""}
          help={errors.prefix?.join(", ")}
        >
          <Input placeholder="Prefix" allowClear />
        </Form.Item>

        <Form.Item
          label="Jenis"
          name="type"
          validateStatus={errors.type ? "error" : ""}
          help={errors.type?.join(", ")}
        >
          <Radio.Group>
            <Radio value="IN">IN</Radio>
            <Radio value="OUT">OUT</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Kamera"
          name="cameras"
          validateStatus={errors.cameras ? "error" : ""}
          help={errors.cameras?.join(", ")}
        >
          <Select mode="multiple" placeholder="Pilih kamera" allowClear>
            {cameras.map((camera) => (
              <Select.Option key={camera.id} value={camera.id}>
                {camera.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal >
  );
};
