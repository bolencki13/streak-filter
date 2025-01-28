import { FilterInputColumnDef } from "../types";
import { BooleanOperatorEnum, DateOperatorEnum, MultiSelectOperatorEnum, NumberOperatorEnum, StringOperatorEnum } from "./consts";

export function getOperatorsForColumnType(column: FilterInputColumnDef) {
  switch (column.type) {
    case 'string': {
      return Object.entries(StringOperatorEnum).map(([key, val]) => {
        return {
          label: val,
          value: key
        }
      })
    }
    case 'number': {
      return Object.entries(NumberOperatorEnum).map(([key, val]) => {
        return {
          label: val,
          value: key
        }
      })
    }
    case 'boolean': {
      return Object.entries(BooleanOperatorEnum).map(([key, val]) => {
        return {
          label: val,
          value: key
        }
      })
    }
    case 'date': {
      return Object.entries(DateOperatorEnum).map(([key, val]) => {
        return {
          label: val,
          value: key
        }
      })
    }
    case 'multi-select': {
      return Object.entries(MultiSelectOperatorEnum).map(([key, val]) => {
        return {
          label: val,
          value: key
        }
      })
    }
    default: {
      return [];
    }
  }
}