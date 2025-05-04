import { Modal, Form, Input, Radio, DatePicker } from "antd";
import CancelButton from "../../components/buttons/CancelButton";
import SaveButton from "../../components/buttons/SaveButton";
import { CustomFormProps, Member } from "../../types";
import StatusTag from "../../components/StatusTag";

export default function MemberForm({ visible, isEditing, onCancel, onOk, errors, form }: CustomFormProps<Member>) {
  return (
    <Modal
      width={450}
      title={isEditing ? "Edit Member" : "Daftar Member Baru"}
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
        labelCol={{ span: 8 }}
        labelAlign="left"
        colon={false}
        style={{ marginTop: 24 }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="Nama"
          name="name"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.join(", ")}
        >
          <Input placeholder="Nama" allowClear />
        </Form.Item>

        <Form.Item
          label="Jenis Kelamin"
          name="gender"
          validateStatus={errors.gender ? "error" : ""}
          help={errors.gender?.join(", ")}
        >
          <Radio.Group>
            <Radio value="M">Laki - Laki</Radio>
            <Radio value="OUT">Perempuan</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="No. KTP"
          name="idNumber"
          validateStatus={errors.idNumber ? "error" : ""}
          help={errors.idNumber?.join(", ")}
        >
          <Input placeholder="No. KTP" allowClear />
        </Form.Item>

        <Form.Item
          label="Grup"
          name="group"
          validateStatus={errors.group ? "error" : ""}
          help={errors.group?.join(", ")}
        >
          <Input placeholder="Grup" allowClear />
        </Form.Item>

        <Form.Item
          label="No. HP"
          name="phone"
          validateStatus={errors.phone ? "error" : ""}
          help={errors.phone?.join(", ")}
        >
          <Input placeholder="No. HP" allowClear />
        </Form.Item>

        <Form.Item
          label="Nomor Kartu"
          name="cardNumber"
          validateStatus={errors.cardNumber ? "error" : ""}
          help={errors.cardNumber?.join(", ")}
        >
          <Input placeholder="Nomor Kartu" allowClear />
        </Form.Item>

        <Form.Item
          label="Nomor Kendaraan"
          name="vehicleNumber"
          validateStatus={errors.vehicleNumber ? "error" : ""}
          help={errors.vehicleNumber?.join(", ")}
        >
          <Input placeholder="Nomor Kendaraan" allowClear />
        </Form.Item>

        <Form.Item
          label="Tgl Kedaluarsa"
          name="expiryDate"
          validateStatus={errors.expiryDate ? "error" : ""}
          help={errors.expiryDate?.join(", ")}
        >
          <DatePicker placeholder="Tgl Kedaularsa" className="w-full" format={"DD-MMM-YYYY"} />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          validateStatus={errors.status ? "error" : ""}
          help={errors.status?.join(", ")}
        >
          <Radio.Group>
            <Radio value={true}><StatusTag status={true} /></Radio>
            <Radio value={false}><StatusTag status={false} /></Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal >
  );
};
