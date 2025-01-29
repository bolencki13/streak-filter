import {
  type PropsWithChildren,
  useState,
  forwardRef,
  type ElementRef,
  type Ref,
  useRef,
  useImperativeHandle,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "./ui/input";

export namespace Autocomplete {
  export type Props<T> = {
    options: {
      label: string;
      value: T;
    }[];
    value?: T;
    onChange?: (newVal: T) => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    optionMatchResolver?: (
      option: Autocomplete.Props<T>["options"][number],
      value: Autocomplete.Props<T>["value"],
    ) => boolean;
  };
}

function AutocompleteComp<T>(
  {
    optionMatchResolver = (option, value) => option.value === value,
    ...props
  }: PropsWithChildren<Autocomplete.Props<T>>,
  outerRef: Ref<ElementRef<"input">>,
) {
  /**
   * State vars
   */
  const refPortalContainer = useRef<ElementRef<'div'>>(null);
  const innerRef = useRef<ElementRef<'input'>>(null)
  useImperativeHandle(outerRef, () => innerRef.current!);

  const [isMouseInside, setIsMouseInside] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [listIndex, setListIndex] = useState(0)

  const matchOption = props.options.find((option) => {
    return optionMatchResolver(option, props.value);
  });

  const [search, setSearch] = useState(() => {
    if (!matchOption) {
      return '';
    }

    return matchOption.label
  });

  const filteredOptions = useMemo(() => {
    return props.options
      .filter((option) => {
        return option.label.toLowerCase().includes(search.toLowerCase())
      })
  }, [props.options, search])

  const renderedOptions = useMemo(() => {
    return (search === matchOption?.label ? props.options : filteredOptions)
  }, [props.options, matchOption, filteredOptions])

  /**
   * Helper funcs
   */
  const selectOption = useCallback((option: Autocomplete.Props<T>['options'][number]) => {
    props.onChange?.(
      option.value
    );
    setSearch(option.label);
    innerRef.current?.focus()
  }, [props.onChange, setSearch, setIsFocused])

  /**
   * Side effects
   */
  useEffect(() => {
    if (isMouseInside) {
      return
    }

    const el = document.getElementById(`item-${listIndex}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [listIndex, isMouseInside]);
  useEffect(() => {
    if (!matchOption && !props.value) {
      setSearch('')
    }
  }, [props.value, matchOption])

  /**
   * Render
   */
  return (
    <div ref={refPortalContainer}>
      <Input
        ref={innerRef}
        disabled={props.disabled}
        placeholder={props.placeholder}
        onBlur={(e) => {
          if (e.relatedTarget?.id === 'command-list') {
            e.preventDefault()
            e.stopPropagation()
            return;
          }
          setListIndex(0)
          setIsFocused(false)
          setSearch(() => {
            if (!matchOption) {
              return ''
            }

            return matchOption.label
          })
        }}
        onFocus={() => {
          setListIndex(0)
          setIsFocused(true)
        }}
        value={search}
        onKeyDown={(e) => {
          const key = e.key.toLowerCase()
          if (key === 'arrowdown') {
            setListIndex((prev) => {
              return Math.min(prev + 1, renderedOptions.length - 1)
            })
            e.preventDefault();
          } else if (key === 'arrowup') {
            setListIndex((prev) => {
              return Math.max(prev - 1, 0)
            })
            e.preventDefault()
          } else if (key === 'enter') {
            const nextOption = renderedOptions[listIndex]
            selectOption(nextOption)
          }
        }}
        onChange={(e) => {
          setSearch(e.currentTarget.value);
        }}
      />
      {
        refPortalContainer.current && isFocused
          ? (
            <Command
              id="command-list"
              shouldFilter={false}
              className="absolute border border-input rounded-md bg-popover min-h-6 max-h-32 w-56 mt-3 overflow-auto shadow-md"
            >
              <div
                className="hidden"
              >
                <CommandInput
                  value={search}
                />
              </div>
              <CommandList>
                <CommandEmpty className={"px-3 py-1.5"}>
                  No results.
                </CommandEmpty>
                <CommandGroup
                  onMouseEnter={() => {
                    setIsMouseInside(true)
                  }}
                  onMouseLeave={() => {
                    setIsMouseInside(false)
                  }}
                >
                  {renderedOptions
                    .map((option, index) => (
                      <CommandItem
                        key={option.label}
                        value={option.label}
                        onMouseEnter={() => setListIndex(index)}
                        className={cn(index === listIndex ? 'bg-accent' : "bg-inherit data-[selected='true']:bg-inherit")}
                        onSelect={() => {
                          selectOption(option)
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
                        <div
                          id={`item-${index}`}
                          className="text-left"
                        >
                          {option.label}
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          )
          : null
      }
    </div>
  );
}

export const Autocomplete = forwardRef<
  ElementRef<"input">,
  PropsWithChildren<Autocomplete.Props<any>>
>(AutocompleteComp) as any as <T>(
  props: PropsWithChildren<Autocomplete.Props<T>> & {
    ref?: Ref<ElementRef<"input">>;
  },
) => ReturnType<typeof AutocompleteComp<T>>;