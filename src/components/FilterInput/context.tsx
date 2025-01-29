import { createContext, useContext } from "react";
import { FilterInputColumnDef } from "./types";
import { addClause, DEFAULT_STATE, deleteClause, FilterInputReducer, setEditableClause, updateClause } from "./reducer";

export namespace FilterInputContext {
  export type Value = {
    columns: FilterInputColumnDef[];
    addClause: (...args: Parameters<typeof addClause>) => void;
    updateClause: (...args: Parameters<typeof updateClause>) => void;
    deleteClause: (...args: Parameters<typeof deleteClause>) => void;
    setEditableClause: (...args: Parameters<typeof setEditableClause>) => void;
  } & FilterInputReducer.Value;
}

export const FilterInputContext = createContext<FilterInputContext.Value>({
  columns: [],
  ...DEFAULT_STATE,
  addClause() {
    // no-opt
  },
  updateClause() {
    // no-opt
  },
  deleteClause() {
    // no-opt
  },
  setEditableClause() {
    // no-opt
  },
});

export function useFilterInput() {
  const context = useContext(FilterInputContext);

  return context;
}