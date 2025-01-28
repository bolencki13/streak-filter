import { useMemo } from "react";
import { Card } from "../ui/card";
import { FilterInputContext } from "./context";
import { FilterInputColumnDef } from "./types";
import { FilterClauseForm } from "./FilterClauseForm";
import { Label } from "../ui/label";

export namespace FilterInput {
  export type Props = {
    columns: FilterInputColumnDef[];
  }
}

export function FilterInput(props: FilterInput.Props) {
  /**
   * State vars
   */
  const contextVal = useMemo(() => {
    return {
      columns: props.columns
    } satisfies FilterInputContext.Value
  }, [props.columns, props.columns.length])

  /**
   * Render
   */
  return (
    <FilterInputContext.Provider value={contextVal}>
      <div className="flex flex-col">
        <Label>In this view show records where</Label>
        <Card className="flex-1 px-3 py-1.5">
          <FilterClauseForm />
        </Card>
      </div>
    </FilterInputContext.Provider>
  )
}