type ResponseType<T> = {
  status: number;
  message: string;
  data: T;
  paginationInfo: null;
};

export type Response = ResponseType<unknown>;
