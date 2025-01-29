import { BooleanOperatorEnum, DateOperatorEnum, MultiSelectOperatorEnum, NumberOperatorEnum, StringOperatorEnum } from "./FilterClauseForm/consts";

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

export type FilterClauseDef<T extends FilterInputColumnDef = FilterInputColumnDef> = {
  id: string;
  column: T;
  operator: T extends FilterInputColumnDefString
  ? StringOperatorEnum
  : T extends FilterInputColumnDefNumber
  ? NumberOperatorEnum
  : T extends FilterInputColumnDefDate
  ? DateOperatorEnum
  : T extends FilterInputColumnDefBoolean
  ? BooleanOperatorEnum
  : T extends FilterInputColumnDefMultiSelect
  ? MultiSelectOperatorEnum
  : unknown;
  value: string;
}