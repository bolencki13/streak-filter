import { FilterInputColumnDef } from "../types";
import { BooleanOperatorEnum, DateOperatorEnum, MultiSelectOperatorEnum, NumberOperatorEnum, StringOperatorEnum } from "./consts";

export function getOperatorsForColumnType(column: FilterInputColumnDef) {
  switch (column.type) {
    case 'string': {
      return Object.values(StringOperatorEnum).map((val) => {
        return {
          label: val,
          value: val
        }
      })
    }
    case 'number': {
      return Object.values(NumberOperatorEnum).map((val) => {
        return {
          label: val,
          value: val
        }
      })
    }
    case 'boolean': {
      return Object.values(BooleanOperatorEnum).map((val) => {
        return {
          label: val,
          value: val
        }
      })
    }
    case 'date': {
      return Object.values(DateOperatorEnum).map((val) => {
        return {
          label: val,
          value: val
        }
      })
    }
    case 'multi-select': {
      return Object.values(MultiSelectOperatorEnum).map((val) => {
        return {
          label: val,
          value: val
        }
      })
    }
    default: {
      return [];
    }
  }
}