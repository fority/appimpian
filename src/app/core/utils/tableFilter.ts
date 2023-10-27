import { FilterMetadata, SortMeta } from 'primeng/api';

export enum FilterOperator {
  'Equals' = '==',
  'NotEquals' = '!=',
  'GreaterThan' = '>',
  'LessThan' = '<',
  'GreaterThanOrEqualTo' = '>=',
  'LessThanOrEqualTo' = '<=',
  'Contains' = '@=',
  'StartsWith' = '_=',
}

export const FilterOperatorOptions = [
  { label: 'Starts With', value: FilterOperator.StartsWith },
  { label: 'Contains', value: FilterOperator.Contains },
];

export const GetSortText = (multiSort?: SortMeta[]): string => {
  let sortText = '';
  if (multiSort && multiSort.length > 0) {
    for (let { field, order } of multiSort) {
      sortText = sortText.concat(`${order < 0 ? '-' : ''}${field}`, ',');
    }
  }
  return sortText;
};

export const GetFilterText = (multiFilter?: { [s: string]: FilterMetadata | FilterMetadata[] | undefined }): string => {
  let filterText = '';
  if (multiFilter) {
    for (let [keys, values] of Object.entries(multiFilter)) {
      if (keys && Array.isArray(values) && 'matchMode' in values[0] && 'value' in values[0] && values[0].value) {
        filterText = filterText.concat(`${keys}${values[0].matchMode}${values[0].value}`, ',');
      }
    }
  }
  return filterText;
};
