type FilterInputColumnDefBase = {
  field: string;
}

type FilterInputColumnDefString = FilterInputColumnDefBase & {
  type: 'string';
}
type FilterInputColumnDefNumber = FilterInputColumnDefBase & {
  type: 'number';
}
type FilterInputColumnDefDate = FilterInputColumnDefBase & {
  type: 'date';
}
type FilterInputColumnDefBoolean = FilterInputColumnDefBase & {
  type: 'boolean';
}
type FilterInputColumnDefMultiSelect<T = unknown> = FilterInputColumnDefBase & {
  type: 'multi-select';
  options: { label: string; value: T }[]
}

export type FilterInputColumnDef = FilterInputColumnDefString | FilterInputColumnDefNumber | FilterInputColumnDefDate | FilterInputColumnDefBoolean | FilterInputColumnDefMultiSelect;