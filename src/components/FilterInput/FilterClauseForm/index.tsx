import { capitalize } from "@/lib/utils";
import { useFilterInput } from "../context"
import { useCallback, useMemo } from "react";
import { Select } from "../../Select";
import { getOperatorsForColumnType } from "./helpers";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/DatePicker";
import { MultiSelect } from "@/components/MultiSelect";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Autocomplete } from "@/components/Autocomplete";

export namespace FilterClauseForm {
  export type Props = {
    column_field?: string;
  }
  export type Form = z.infer<typeof FormSchema>;
}

const FormSchema = z.object({
  columnField: z.string().trim(),
  operator: z.string().trim(),
  value: z.coerce.string()
})

export function FilterClauseForm() {
  /**
   * State vars
   */
  const { columns } = useFilterInput();
  const form = useForm<FilterClauseForm.Form>({
    defaultValues: {
      columnField: '',
      operator: '',
      value: '',
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
    console.log('submitted', values)
  }, [])

  /**
   * Render
   */
  return (
    <Form
      {...form}>
      <div
        className="flex flex-nowrap gap-1.5"
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
                              {...field}
                              value={field.value ? new Date(field.value) : null}
                              onChange={(val) => field.onChange(val?.toISOString())}
                            />
                          )
                          : chosenColumn.type === 'boolean'
                            ? (
                              <Select
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
                                <MultiSelect
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
      </div>
    </Form>
  )
}