import { useMemo, useReducer } from "react";
import { Card } from "../ui/card";
import { FilterInputContext } from "./context";
import { FilterInputColumnDef } from "./types";
import { FilterClauseForm } from "./FilterClauseForm";
import { Label } from "../ui/label";
import { addClause, DEFAULT_STATE, deleteClause, handleAction, updateClause } from "./reducer";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export namespace FilterInput {
  export type Props = {
    columns: FilterInputColumnDef[];
  }
}

export function FilterInput(props: FilterInput.Props) {
  /**
   * State vars
   */
  const [state, dispatch] = useReducer(handleAction, DEFAULT_STATE)
  const contextVal = useMemo(() => {
    return {
      columns: props.columns,
      ...state,
      addClause(clause) {
        dispatch(addClause(clause))
      },
      updateClause(clause) {
        dispatch(updateClause(clause))
      },
      deleteClause(clause) {
        dispatch(deleteClause(clause))
      },
    } satisfies FilterInputContext.Value;
  }, [props.columns, props.columns.length, dispatch])

  /**
   * Render
   */
  return (
    <FilterInputContext.Provider value={contextVal}>
      <div className="flex flex-col min-w-96 gap-3">
        <div className="flex items-end justify-between">
          <Label>In this view show records where</Label>
          <Button size="icon" className="size-6">
            <Plus />
          </Button>
        </div>
        <Card className={cn("flex-1 px-3 py-1.5 flex flex-wrap gap-1.5 min-h-12", state.clauses.length < 1 && 'items-center')}>
          {
            state.clauses
              .map((clause) => {
                return (
                  <FilterClauseForm
                    clause={clause}
                  />
                )
              })
          }
          {
            state.clauses.length < 1
              ? (
                <p className="w-full text-muted-foreground text-center text-sm">Nothing to show.</p>
              )
              : null
          }
        </Card>
      </div>
    </FilterInputContext.Provider >
  )
}