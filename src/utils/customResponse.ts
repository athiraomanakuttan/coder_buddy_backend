export interface CustomResponse<T> {
    status: boolean;
    message: string;
    data: T | null;
  }
  