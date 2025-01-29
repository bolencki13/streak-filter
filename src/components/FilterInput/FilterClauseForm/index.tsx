import { capitalize } from "@/lib/utils";
import { useFilterInput } from "../context"
import { useCallback, useMemo } from "react";
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
import { Command, Delete, MoreVerticalIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
  const filterInput = useFilterInput();
  const { columns } = useFilterInput();
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
    return columns.find((col) => {
      return col.field === columnField
    })
  }, [columns, columnField])

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
  }, [props.clause, chosenColumn])

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
        }}
      >
        <FormField
          control={form.control}
          name="columnField"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Autocomplete
                  placeholder="Select..."
                  {...field}
                  options={columns.map((col) => {
                    return {
                      label: capitalize(col.field).split('_').join(' '),
                      value: col.field
                    }
                  })}
                  onChange={(val) => {
                    field.onChange(val)
                    form.setValue('operator', '')
                    form.setValue('value', '')
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
                  placeholder="None"
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

                  form.handleSubmit(handleSubmit)()
                }
              }}>
                {
                  !chosenColumn
                    ? (
                      <Input
                        disabled
                        {...field}
                      />
                    )
                    : chosenColumn.type === 'string'
                      ? (
                        <Input
                          tabIndex={3}
                          {...field}
                        />
                      )
                      : chosenColumn.type === 'number'
                        ? (
                          <Input
                            tabIndex={3}
                            type="number"
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
                                options={[
                                  {
                                    label: 'true',
                                    value: true
                                  },
                                  {
                                    label: 'false',
                                    value: false
                                  },
                                ]}
                                {...field}
                              />
                            )
                            : chosenColumn.type === 'multi-select'
                              ? (
                                <MultiAutocomplete
                                  tabIndex={3}
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