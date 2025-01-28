import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ElementRef, forwardRef, PropsWithChildren, Ref } from "react"

export namespace DatePicker {
  export type Props = {
    value?: Date | null;
    onChange?: (val: Date | null) => void;
  }
}

function DatePickerComp(
  props: DatePicker.Props,
  outerRef: Ref<ElementRef<"button">>
) {
  /**
   * Render
   */
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          ref={outerRef}
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !props.value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {props.value ? format(props.value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={props.value ?? undefined}
          onSelect={(val) => {
            props.onChange?.(val ?? null)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export const DatePicker = forwardRef<
  ElementRef<"button">,
  PropsWithChildren<DatePicker.Props>
>(DatePickerComp) as any as (
  props: PropsWithChildren<DatePicker.Props> & {
    ref?: Ref<ElementRef<"button">>;
  },
) => ReturnType<typeof DatePickerComp>;