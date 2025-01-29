import { Input } from "./ui/input"
import {
  type PropsWithChildren,
  useState,
  forwardRef,
  type ElementRef,
  type Ref,
  useRef,
  useImperativeHandle,
} from "react";
import { Calendar } from "./ui/calendar";
import { isChildOfParent } from "@/lib/utils";
import dayjs from 'dayjs'

export namespace DatePicker {
  export type Props = {
    value?: string | null;
    onChange?: (val: string) => void;
    disabled?: boolean;
    onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
  } & Pick<React.HTMLAttributes<HTMLInputElement>, 'tabIndex'>;
}

function DatePickerComp(
  props: DatePicker.Props,
  outerRef: Ref<ElementRef<"input">>
) {
  /**
    * State vars
    */
  const refPortalContainer = useRef<ElementRef<'div'>>(null);
  const innerRef = useRef<ElementRef<'input'>>(null)
  useImperativeHandle(outerRef, () => innerRef.current!);

  const [search, setSearch] = useState(() => {
    if (!props.value) {
      return '';
    }

    if (!dayjs(props.value).isValid()) {
      return '';
    }

    return dayjs(props.value).format('yyyy/MM/dd')
  })
  const [isFocused, setIsFocused] = useState(false);

  /**
   * Render
   */
  return (
    <div ref={refPortalContainer}>
      <Input
        ref={innerRef}
        placeholder="yyyy/MM/dd"
        className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
        disabled={props.disabled}
        value={
          search
        }
        tabIndex={props.tabIndex}
        onKeyDown={(e) => {
          const key = e.key.toLowerCase();
          if (key.includes('arrow')) {
            e.preventDefault()
          }
          props.onKeyDown?.(e)
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          const targetParent = document.getElementById('calendar-picker');
          if (e.relatedTarget && targetParent && isChildOfParent(e.relatedTarget, targetParent)) {
            e.preventDefault()
            e.stopPropagation()
            return;
          }

          setIsFocused(false)
        }}
        onChange={(e) => {
          const nextVal = e.currentTarget.value
          setSearch(nextVal);

          if (dayjs(nextVal).isValid()) {
            props.onChange?.(nextVal)
          }
        }}
        pattern="[0-9]{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])"
      />
      {
        refPortalContainer.current && isFocused
          ? (
            <div
              onKeyDown={(e) => {
                props.onKeyDown?.(e)
              }}
            >
              <Calendar
                id="calendar-picker"
                className="absolute border border-input rounded-md bg-popover mt-3 overflow-auto shadow-md"
                mode="single"
                selected={search && dayjs(search).isValid() ? new Date(search) : undefined}
                onSelect={(val) => {
                  const nextVal = dayjs(val).format('YYYY/MM/DD')
                  setSearch(nextVal)
                }}
                month={search && dayjs(search).isValid() ? new Date(search) : undefined}
              />
            </div>
          )
          : null
      }
    </div>
  )
}

export const DatePicker = forwardRef<
  ElementRef<"input">,
  PropsWithChildren<DatePicker.Props>
>(DatePickerComp) as any as (
  props: PropsWithChildren<DatePicker.Props> & {
    ref?: Ref<ElementRef<"button">>;
  },
) => ReturnType<typeof DatePickerComp>;