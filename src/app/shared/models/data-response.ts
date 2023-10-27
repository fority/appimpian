export interface BaseResponseWithData<T> {
  Success: boolean;
  Message: string;
  Data: T;
}
export interface BaseResponse {
  Success: boolean;
  Message: string;
}

export interface PagingContent<T> {
  TotalElements: number;
  Content: T[];
}
