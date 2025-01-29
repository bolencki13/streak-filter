import { useState } from "react";
import { FilterInput } from "./components/FilterInput";
import { PEOPLE } from "./data";
import { FilterClauseDef } from "./components/FilterInput/types";
import { Label } from "./components/ui/label";

export function App() {
  /**
   * State vars
   */
  const [val, setVal] = useState<FilterClauseDef[]>([]);

  /**
   * Render
   */
  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <FilterInput
        onChange={setVal}
        columns={
          [
            {
              field: 'name',
              type: 'string'
            },
            {
              field: 'age',
              type: 'number',
            },
            {
              field: 'date_of_birth',
              type: 'date',
            },
            {
              field: 'is_18_or_over',
              type: 'boolean',
            },
            {
              field: 'favorite_foods',
              type: 'multi-select',
              options: Array.from(
                PEOPLE.reduce((foods: Set<string>, person) => {
                  person.favorite_foods.forEach((food) => foods.add(food))
                  return foods;
                }, new Set<string>())
              )
                .map((food) => {
                  return {
                    label: food,
                    value: food
                  }
                })
            },
          ]
        }
      />

      <div
        className="mt-4"
      >
        <Label>Filter schema:</Label>
        <pre>
          {JSON.stringify(val, undefined, 2)}
        </pre>
      </div>
    </div>
  )
}