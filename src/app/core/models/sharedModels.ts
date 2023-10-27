import { HttpHeaders } from '@angular/common/http';

export interface SelectOption<T> {
  value: T;
  label: string;
}
export interface BaseResponseWithData<T> extends BaseResponse {
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

export interface PagingSettings {
  page: number;
  pageSize: number;
  searchText: string;
  filter?: string | null;
  sort?: string | null;
}

export const DefaultPage = 1;
export const DefaultPageSize = 12;

export const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'Application/json' }),
};

export interface ExpandableRow {
  expand: boolean;
}

// export interface BasicPageSettings {
//   page: number;
//   pageSize: number;
//   searchText: string;
// }

export interface CanSelect {
  isSelected: boolean;
}

export interface CanEdit {
  edit?: boolean;
}

export interface EditCache<T> {
  [key: string]: { edit: boolean; data: T };
}
