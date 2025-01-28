import {
  type PropsWithChildren,
  useState,
  forwardRef,
  type ElementRef,
  type Ref,
} from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export namespace Select {
  export type Props<T> = {
    options: {
      label: string;
      description?: string | null;
      value: T;
    }[];
    value?: T;
    onChange?: (newVal: T) => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    optionMatchResolver?: (
      option: Select.Props<T>["options"][number],
      value: Select.Props<T>["value"],
    ) => boolean;
    clearable?: boolean;
  };
}

function SelectComp<T>(
  {
    placeholder = "Select...",
    optionMatchResolver = (option, value) => option.value === value,
    ...props
  }: PropsWithChildren<Select.Props<T>>,
  outerRef: Ref<ElementRef<"button">>,
) {
  /**
   * State vars
   */
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  /**
   * Render
   */
  const matchOption = props.options.find((option) => {
    return optionMatchResolver(option, props.value);
  });
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={props.disabled}>
        <Button
          ref={outerRef}
          disabled={props.disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between border-input hover:border-input",
            matchOption && "text-foreground",
            props.className,
          )}
        >
          {matchOption ? (
            <div className="text-left">
              {matchOption.label}
            </div>
          ) : props.disabled ? (
            "None"
          ) : (
            placeholder
          )}
          <div className="flex flex-nowrap items-center">
            {props.value && props.clearable ? (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  props.onChange?.(null as any);
                }}
                variant="ghost"
                className={"px-2 opacity-50"}
              >
                <X />
              </Button>
            ) : null}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            value={search}
            onValueChange={(v) => setSearch(v)}
            placeholder="Search..."
          />
          <CommandList>
            <CommandEmpty className={""}>
              No results.
            </CommandEmpty>
            <CommandGroup>
              {props.options.map((option) => (
                <CommandItem
                  key={option.label}
                  value={option.label}
                  onSelect={() => {
                    props.onChange?.(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      props.value === option.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <div className="text-left">
                    {option.label}
                    {option.description ? (
                      <p
                        className="text-xs text-muted-foreground"
                      >
                        {option.description}
                      </p>
                    ) : null}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export const Select = forwardRef<
  ElementRef<"button">,
  PropsWithChildren<Select.Props<any>>
>(SelectComp) as any as <T>(
  props: PropsWithChildren<Select.Props<T>> & {
    ref?: Ref<ElementRef<"button">>;
  },
) => ReturnType<typeof SelectComp<T>>;