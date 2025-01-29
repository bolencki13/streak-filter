import { createContext, useContext } from "react";
import { FilterInputColumnDef } from "./types";
import { addClause, deleteClause, FilterInputReducer, updateClause } from "./reducer";

export namespace FilterInputContext {
  export type Value = {
    columns: FilterInputColumnDef[];
    addClause: (...args: Parameters<typeof addClause>) => void;
    updateClause: (...args: Parameters<typeof updateClause>) => void;
    deleteClause: (...args: Parameters<typeof deleteClause>) => void;
  } & FilterInputReducer.Value;
}

export const FilterInputContext = createContext<FilterInputContext.Value>({
  columns: [],
  clauses: [],
  addClause() {
    // no-opt
  },
  updateClause() {
    // no-opt
  },
  deleteClause() {
    // no-opt
  },
});

export function useFilterInput() {
  const context = useContext(FilterInputContext);

  return context;
}