import React from "react";
import { Button } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

type CancelButtonProps = {
    label: string;
    onCancel: () => void;
};

const CancelButton: React.FC<CancelButtonProps> = ({ label, onCancel }) => {
    return (
        <Button icon={<CloseCircleOutlined />} onClick={onCancel}>
            {label || 'Cancel'}
        </Button>
    );
};

export default CancelButton;
