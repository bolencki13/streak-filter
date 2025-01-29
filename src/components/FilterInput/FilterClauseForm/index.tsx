import { capitalize } from "@/lib/utils";
import { useFilterInput } from "../context"
import { ElementRef, useCallback, useEffect, useMemo, useRef } from "react";
import { getOperatorsForColumnType } from "./helpers";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/DatePicker";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Autocomplete } from "@/components/Autocomplete";
import { MultiAutocomplete } from "@/components/MultiAutocomplete";
import { FilterClauseDef } from "../types";
import { CheckCircle, Command, Delete, MoreVerticalIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export namespace FilterClauseForm {
  export type Props = {
    clause?: FilterClauseDef;
  }
  export type Form = z.infer<typeof FormSchema>;
}

const FormSchema = z.object({
  columnField: z.string().trim(),
  operator: z.string().trim(),
  value: z.coerce.string()
})

export function FilterClauseForm(props: FilterClauseForm.Props) {
  /**
   * State vars
   */
  const refColumnField = useRef<ElementRef<'input'>>(null);

  const filterInput = useFilterInput();
  const form = useForm<FilterClauseForm.Form>({
    values: {
      columnField: props.clause?.column.field ?? '',
      operator: props.clause?.operator ?? '',
      value: props.clause?.value ?? '',
    },
    resolver: zodResolver(FormSchema)
  });
  const columnField = form.watch('columnField')

  const chosenColumn = useMemo(() => {
    return filterInput.columns.find((col) => {
      return col.field === columnField
    })
  }, [filterInput.columns, columnField])

  /**
   * Helper funcs
   */
  const handleSubmit: SubmitHandler<FilterClauseForm.Form> = useCallback((values) => {
    if (props.clause) {
      filterInput.updateClause({
        ...props.clause,
        ...values,
      } as FilterClauseDef)
    } else if (chosenColumn) {
      filterInput.addClause({
        ...values,
        column: chosenColumn
      } as Omit<FilterClauseDef, 'id'>)
    }

    let currentEditIndex = filterInput.clauses.length;
    if (props.clause) {
      currentEditIndex = filterInput.clauses.findIndex((clause) => {
        return props.clause?.id === clause.id
      })
    }

    if (currentEditIndex >= filterInput.clauses.length) {
      filterInput.setEditableClause(null)
    } else {
      const nextEditClause = filterInput.clauses[Math.min(currentEditIndex + 1, filterInput.clauses.length)];
      filterInput.setEditableClause(nextEditClause)
    }
    form.reset()
  }, [props.clause, chosenColumn, filterInput.clauses, filterInput.addClause, filterInput.updateClause, filterInput.setEditableClause, form.reset])

  /**
   * Side effects
   */
  useEffect(() => {
    if (!refColumnField.current) {
      return;
    }

    refColumnField.current.focus()
  }, [props.clause])

  /**
   * Render
   */
  return (
    <Form
      {...form}
    >
      <div
        className="flex flex-nowrap gap-1.5"
        onKeyDown={(e) => {
          const key = e.key.toLowerCase();
          if (key === 'backspace' && (e.ctrlKey || e.metaKey) && props.clause) {
            filterInput.deleteClause(props.clause)
          }

          if (refColumnField.current === document.activeElement && key === 'tab' && e.shiftKey) {
            let currentEditIndex = filterInput.clauses.length;
            if (props.clause) {
              currentEditIndex = filterInput.clauses.findIndex((clause) => {
                return props.clause?.id === clause.id
              })
            }

            if (currentEditIndex >= 0) {
              const nextEditClause = filterInput.clauses[Math.max(currentEditIndex - 1, 0)];
              filterInput.setEditableClause(nextEditClause)
            }

            e.preventDefault()
            e.stopPropagation()
          }
        }}
      >
        <FormField
          control={form.control}
          name="columnField"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Autocomplete
                  placeholder="Column"
                  {...field}
                  ref={refColumnField}
                  options={filterInput.columns.map((col) => {
                    return {
                      label: capitalize(col.field).split('_').join(' '),
                      value: col.field
                    }
                  })}
                  onChange={(val) => {
                    field.onChange(val)

                    if (val !== field.value) {
                      form.setValue('operator', '')
                      form.setValue('value', '')
                    }
                  }}
                  tabIndex={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="operator"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Autocomplete
                  placeholder="Operator"
                  disabled={!chosenColumn}
                  options={
                    chosenColumn
                      ? getOperatorsForColumnType(chosenColumn)
                      : []
                  }
                  {...field}
                  tabIndex={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormControl onKeyDown={(e) => {
                const key = e.key.toLowerCase();
                if (['tab'].includes(key) && !e.shiftKey) {
                  e.preventDefault();
                  e.stopPropagation();

                  form.handleSubmit(handleSubmit)();

                  if (refColumnField.current) {
                    refColumnField.current.focus()
                  }
                }
              }}>
                {
                  !chosenColumn
                    ? (
                      <Input
                        disabled
                        placeholder="Value"
                        {...field}
                      />
                    )
                    : chosenColumn.type === 'string'
                      ? (
                        <Input
                          tabIndex={3}
                          placeholder="Value"
                          {...field}
                        />
                      )
                      : chosenColumn.type === 'number'
                        ? (
                          <Input
                            tabIndex={3}
                            type="number"
                            placeholder="Value"
                            {...field}
                          />
                        )
                        : chosenColumn.type === 'date'
                          ? (
                            <DatePicker
                              tabIndex={3}
                              {...field}
                            />
                          )
                          : chosenColumn.type === 'boolean'
                            ? (
                              <Autocomplete
                                tabIndex={3}
                                placeholder="Value"
                                options={[
                                  {
                                    label: 'true',
                                    value: 'true'
                                  },
                                  {
                                    label: 'false',
                                    value: 'false'
                                  },
                                ]}
                                {...field}
                              />
                            )
                            : chosenColumn.type === 'multi-select'
                              ? (
                                <MultiAutocomplete
                                  tabIndex={3}
                                  placeholder="Value"
                                  options={chosenColumn.options}
                                  {...field}
                                  value={field.value?.split('|')}
                                  onChange={(val) => {
                                    field.onChange(val.join('|'))
                                  }}
                                />
                              )
                              : (
                                <Input
                                  disabled
                                  {...field}
                                />
                              )
                }
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          size="icon"
          className="size-6 mt-2"
          variant="ghost"
          onClick={() => {
            form.handleSubmit(handleSubmit)()
          }}
        >
          <CheckCircle />
        </Button>
        {
          props.clause
            ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVerticalIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="flex items-center justify-between cursor-pointer" onClick={() => {
                    if (!props.clause) {
                      return;
                    }
                    filterInput.deleteClause(props.clause)
                  }}>
                    Trash
                    <div className="flex items-center flex-nowrap">
                      <Command />
                      <Delete />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
            : null
        }
      </div>
    </Form>
  )
}