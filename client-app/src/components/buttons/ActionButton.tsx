import React from "react";
import { Button, Dropdown, MenuProps } from "antd";
import { EditOutlined, DeleteOutlined, EllipsisOutlined } from "@ant-design/icons";

type ActionButtonProps = {
  allowEdit?: boolean
  allowDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  additionalItems?: MenuProps['items'];
};

const ActionButton: React.FC<ActionButtonProps> = ({ allowEdit = true, allowDelete = true, onEdit, onDelete, additionalItems }) => {
  const items: MenuProps['items'] = [];

  if (allowEdit) {
    items.push({ key: "edit", label: 'Edit', icon: <EditOutlined />, onClick: onEdit });
  }

  if (allowDelete) {
    items.push({ key: "delete", label: 'Hapus', icon: <DeleteOutlined />, onClick: onDelete });
  }

  if (additionalItems) {
    items.push(...additionalItems);
  }

  return (
    <Dropdown menu={{ items }} placement="bottom" arrow>
      <Button size="small" type="link" icon={<EllipsisOutlined />} />
    </Dropdown>

  )
};

export default ActionButton;
