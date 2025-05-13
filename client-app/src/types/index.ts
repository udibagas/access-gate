import { FormInstance } from "antd";
import { AxiosError } from "axios";

export interface Gate {
  id: number;
  name: string;
  device: string;
}

export interface Camera {
  id: number;
  name: string;
  url: string;
  user: string;
  password: string;
}

export interface Reader {
  id: number;
  name: string;
  prefix: string;
  type: "IN" | "OUT";
  GateId: number;
  gate: Gate;
  cameras: Camera[];
}

export interface Member {
  id: number;
  name: string;
  phone: string;
  cardNumber: string;
  vehicleNumber: string;
  gender: "F" | "M";
  status: boolean;
  expiryDate: Date;
  group: string;
  idNumber: string;
}

interface Snapshot {
  filepath: string;
  createdAt: string;
}

export interface AccessLogType {
  id: number;
  member: Member;
  gate: Gate;
  snapshots: Snapshot[];
  reader: Reader;
  cardNumber: string;
  vehicleNumber: string;
  type: "IN" | "OUT";
  createdAt: string;
  updatedAt: string;
}

export type ServerErrorResponse = AxiosError & {
  status: number;
  code: string;
  response: {
    data: {
      message: string;
      errors?: Record<string, string[]>;
    };
  };
};

export type PaginatedData<T> = {
  from: number;
  to: number;
  page: number;
  rows: T[];
  total: number;
};

export type AxiosErrorResponseType = {
  message: string;
  errors?: Record<string, string[]>;
};

export type RecursivePartial<T> = NonNullable<T> extends object
  ? {
      [P in keyof T]?: NonNullable<T[P]> extends (infer U)[]
        ? RecursivePartial<U>[]
        : NonNullable<T[P]> extends object
        ? RecursivePartial<T[P]>
        : T[P];
    }
  : T;

export type CustomFormProps<T> = {
  visible: boolean;
  isEditing: boolean;
  onCancel: () => void;
  onOk: (values: T) => void;
  errors: { [key: string]: string[] };
  form: FormInstance<T>;
};

export type UserType = {
  id: number;
  name: string;
  role: "admin" | "user";
};

export type FileType = {
  filename: string;
  mimetype: string;
  originalname: string;
  path: string;
  url: string;
  size: number;
};
