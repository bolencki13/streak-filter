import { createContext, useContext } from "react";
import { FilterInputColumnDef } from "./types";

export namespace FilterInputContext {
  export type Value = {
    columns: FilterInputColumnDef[];
  }
}

export const FilterInputContext = createContext<FilterInputContext.Value>({
  columns: [],
});

export function useFilterInput() {
  const context = useContext(FilterInputContext);

  return context;
}