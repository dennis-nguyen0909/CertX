import { PageInfo } from "@/models/common";

type ResponseType<T> = {
  status: number;
  message: string;
  data: T;
  paginationInfo: PageInfo | null;
};

export type Response = ResponseType<unknown>;

export type ResponseMessage = {
  message: string;
  status: number;
  data: null;
};
