import { FilterInput } from "./components/FilterInput";
import { PEOPLE } from "./data";

console.log(PEOPLE)

export function App() {
  /**
   * Render
   */
  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <FilterInput
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

    </div>
  )
}