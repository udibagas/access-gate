/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileType } from "../types";
import axios from "axios";

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface DataTableServerResponse<TData> {
  data: TData[];
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export const axiosInstance = axios.create({
  // Dont forget to change this in production
  // baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
});

export default async function fetchData<TData>(
  url: string,
  params: Record<string, any> = {}
) {
  const { data } = await axiosInstance.get<DataTableServerResponse<TData>>(
    url,
    { params }
  );

  return data;
}

export async function getItems<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {}
): Promise<T> {
  const { data } = await axiosInstance.get<T>(endpoint, { params });
  return data;
}

export async function getItem<T>(endpoint: string, id: number): Promise<T> {
  const { data } = await axiosInstance.get<T>(`${endpoint}/${id}`);
  return data;
}

export async function createItem<T>(endpoint: string, item: T): Promise<T> {
  const { data } = await axiosInstance.post(endpoint, item);
  return data;
}

export async function updateItem<T>(
  endpoint: string,
  id: number,
  item: T
): Promise<T> {
  const { data } = await axiosInstance.put(`${endpoint}/${id}`, item);
  return data;
}

export function deleteItem(endpoint: string, id: number): Promise<void> {
  return axiosInstance.delete(`${endpoint}/${id}`);
}

export async function uploadFile(file: File): Promise<FileType> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axiosInstance.post("/upload", formData);
  return data;
}
