import { capitalize } from "@/lib/utils";
import { FilterClauseDef } from "./types";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useFilterInput } from "./context";

export namespace FilterClauseView {
  export type Props = {
    clause: FilterClauseDef;
    index: number;
  }
}

export function FilterClauseView(props: FilterClauseView.Props) {
  /**
   * State vars
   */
  const filterInput = useFilterInput();

  /**
   * Render
   */
  return (
    <div className="flex items-center justify-center rounded-full py-1.5 px-3 bg-accent gap-1.5">
      {
        props.index > 0
          ? (
            <p className="text-sm">and</p>
          )
          : null
      }
      <p className="font-semibold">{capitalize(props.clause.column.field.split('_').join(' '))}</p>
      <p className="text-sm">
        {props.clause.operator}
      </p>
      <p className="font-semibold">{props.clause.value}</p>
      <Button
        className="size-4"
        size="icon"
        variant="outline"
        onClick={() => {
          filterInput.deleteClause(props.clause)
        }}
      >
        <Trash2 className="size-1" />
      </Button>
    </div>
  )
}