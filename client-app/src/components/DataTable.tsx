import { PaginatedData } from "../types";
import { Table } from "antd";
import { useDataTableContext } from "../hooks/useDataTable";
import { JSX } from "react";

interface DataTableProps<T> {
  paginated?: boolean;
  columns: {
    title: string | JSX.Element;
    dataIndex?: string;
    key?: string;
    render?: (text: string, record: T, index: number) => React.ReactNode;
    width?: number;
    align?: "left" | "right" | "center";
  }[];
}

export default function DataTable<T extends { id: number }>({ columns, paginated = false }: DataTableProps<T>) {
  const { useFetch, setPageSize, setCurrentPage, currentPage } = useDataTableContext()
  type FetchDataType = PaginatedData<T> | T[];
  const { isPending, data } = useFetch<FetchDataType>();

  if (paginated) {
    return (
      <Table
        scroll={{ y: 'calc(100vh - 300px)' }}
        loading={isPending}
        size="small"
        columns={columns}
        dataSource={(data as PaginatedData<T>)?.rows ?? []}
        rowKey="id"
        pagination={{
          size: "small" as const,
          current: currentPage,
          total: (data as PaginatedData<T>)?.total ?? 0,
          showSizeChanger: true,
          showTotal: (total: number, range: number[]) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page: number, pageSize: number) => {
            setPageSize(pageSize);
            setCurrentPage(page);
          },
        }}
      />
    )
  }

  return (
    <Table
      scroll={{ y: 'calc(100vh - 300px)' }}
      loading={isPending}
      size="small"
      columns={columns}
      dataSource={(data as T[]) ?? []}
      rowKey="id"
      pagination={false}
    />
  )

}
