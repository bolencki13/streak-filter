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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export namespace MultiAutocomplete {
  export type Props<T> = {
    options: {
      label: string;
      value: T;
    }[];
    value?: T[];
    onChange?: (newVal: T[]) => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    optionMatchResolver?: (
      option: MultiAutocomplete.Props<T>["options"][number],
      value: T,
    ) => boolean;
  } & Pick<React.HTMLAttributes<HTMLInputElement>, 'tabIndex' | "onKeyDown">;
}

function MultiAutocompleteComp<T>(
  {
    optionMatchResolver = (option, value) => option.value === value,
    ...props
  }: PropsWithChildren<MultiAutocomplete.Props<T>>,
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

  const matchOptions = props.options.filter((option) => {
    return !!props.value?.find((val) => optionMatchResolver(option, val));
  });

  const [search, setSearch] = useState('');

  const filteredOptions = useMemo(() => {
    return props.options
      .filter((option) => {
        return option.label.toLowerCase().includes(search.toLowerCase())
      })
  }, [props.options, search])

  const renderedOptions = useMemo(() => {
    return (matchOptions.length && search === matchOptions.at(-1)?.label ? props.options : filteredOptions)
  }, [props.options, matchOptions, filteredOptions])

  /**
   * Helper funcs
   */
  const selectOption = useCallback((options: MultiAutocomplete.Props<T>['options']) => {
    props.onChange?.(
      options.map((option) => {
        return option.value
      })
    );
    setSearch('');
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
    if (!matchOptions.length && !props.value) {
      setSearch('')
    }
  }, [props.value, matchOptions])

  /**
   * Render
   */
  return (
    <TooltipProvider>
      <Tooltip>
        {
          !isFocused
            ? (
              <TooltipContent>
                <p>{matchOptions.map((v) => v.label).join(', ')}</p>
              </TooltipContent>
            )
            : null
        }
        <div ref={refPortalContainer} className="border border-input rounded-md overflow-x-hidden overflow-y-auto ring-offset-background focus-visible:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <TooltipTrigger>
            {
              isFocused && matchOptions.length
                ? (
                  <p className="text-xs inline-flex flex-wrap px-3">{matchOptions.map((v, index, arr) => {
                    const isLast = index >= arr.length - 1
                    return (
                      <span key={v.label}>{v.label}{isLast ? '' : ', '}</span>
                    )
                  })}</p>
                )
                : null
            }
            <Input
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                setSearch('')
              }}
              onFocus={() => {
                setListIndex(0)
                setIsFocused(true)
              }}
              value={isFocused ? search : matchOptions.map((option) => option.label).join(', ')}
              tabIndex={props.tabIndex}
              onKeyDown={(e) => {
                props.onKeyDown?.(e)
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
                  const nextOption = renderedOptions[listIndex];

                  const setOptions = new Set(props.value ?? [])
                  if (setOptions.has(nextOption.value)) {
                    setOptions.delete(nextOption.value);
                  } else {
                    setOptions.add(nextOption.value)
                  }
                  selectOption(
                    props.options.filter((option) => {
                      return !!Array.from(setOptions)?.find((val) => optionMatchResolver(option, val));
                    })
                  )
                }
              }}
              onChange={(e) => {
                setSearch(e.currentTarget.value);
              }}
            />
          </TooltipTrigger>
          {
            refPortalContainer.current && isFocused
              ? (
                <Command
                  tabIndex={-1}
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
                              const setOptions = new Set(props.value ?? [])
                              if (setOptions.has(option.value)) {
                                setOptions.delete(option.value);
                              } else {
                                setOptions.add(option.value)
                              }
                              selectOption(
                                props.options.filter((option) => {
                                  return !!Array.from(setOptions)?.find((val) => optionMatchResolver(option, val));
                                })
                              )
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
      </Tooltip>
    </TooltipProvider>
  );
}

export const MultiAutocomplete = forwardRef<
  ElementRef<"input">,
  PropsWithChildren<MultiAutocomplete.Props<any>>
>(MultiAutocompleteComp) as any as <T>(
  props: PropsWithChildren<MultiAutocomplete.Props<T>> & {
    ref?: Ref<ElementRef<"input">>;
  },
) => ReturnType<typeof MultiAutocompleteComp<T>>;