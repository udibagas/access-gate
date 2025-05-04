import { Tag } from "antd";

export default function StatusTag({ status }: { status: boolean }) {
  return (
    <Tag color={status ? "#87d068" : "#f50"}>{status ? "Aktif" : "Tidak Aktif"}</Tag>
  );
}