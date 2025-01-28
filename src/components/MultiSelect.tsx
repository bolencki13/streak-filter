import { type PropsWithChildren, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommandList } from "cmdk";

export namespace MultiSelect {
  export type Props<T> = {
    defaultOpen?: boolean;
    options: {
      label: string;
      description?: string;
      value: T;
    }[];
    value?: T[];
    onChange?: (newVal: T[]) => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    optionMatchResolver?: (
      option: MultiSelect.Props<T>["options"][number],
      value: T,
    ) => boolean;
  };
}

export const MultiSelect = function <T>({
  placeholder = "Select...",
  optionMatchResolver = (option, value) => option.value === value,
  defaultOpen = false,
  ...props
}: PropsWithChildren<MultiSelect.Props<T>>) {
  /**
   * State vars
   */
  const [open, setOpen] = useState(defaultOpen);
  const [search, setSearch] = useState("");

  /**
   * Render
   */
  const matchOptions = props.options.filter((option) => {
    return !!props.value?.find((val) => optionMatchResolver(option, val));
  });
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={props.disabled}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between border-input hover:border-input min-h-10 h-auto text-foreground",
            !props.disabled && !matchOptions.length && "text-muted-foreground",
            props.className,
          )}
          disabled={props.disabled}
        >
          {matchOptions.length ? (
            <span className=" max-h-14 overflow-y-auto whitespace-pre-wrap text-left">
              {matchOptions.map((option) => option.label).join(", ")}
            </span>
          ) : props.disabled ? (
            "None"
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            value={search}
            onValueChange={(v) => setSearch(v)}
            placeholder="Search..."
          />
          <CommandEmpty className={""}>
            <p className="px-3">
              No results.
            </p>
          </CommandEmpty>
          <CommandList>
            <CommandGroup>
              {props.options.map((option) => (
                <CommandItem
                  key={option.label}
                  value={option.label}
                  onSelect={() => {
                    let nextVal = structuredClone(props.value ?? []);
                    if (props.value?.includes(option.value)) {
                      nextVal = nextVal.filter((val) => {
                        return !optionMatchResolver(option, val);
                      });
                    } else {
                      nextVal.push(option.value);
                    }
                    props.onChange?.(nextVal);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      props.value?.includes(option.value)
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
};