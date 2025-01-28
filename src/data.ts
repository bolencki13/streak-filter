import { faker } from '@faker-js/faker'

export type Person = {
  name: string;
  age: number;
  date_of_birth: Date;
  is_18_or_over: boolean;
  favorite_foods: string[];
}

export const PEOPLE: Person[] = Array.from(new Array(24))
  .map(() => {
    return {
      name: faker.person.fullName(),
      date_of_birth: faker.date.birthdate({ min: 13, max: 60, mode: 'age' }),
      get age() {
        const ageDifMs = Date.now() - this.date_of_birth.getDate();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
      },
      get is_18_or_over() {
        return this.age >= 18
      },
      favorite_foods: Array.from(new Array(faker.number.int({ min: 1, max: 5 })))
        .map(() => {
          return faker.food.dish()
        })
    } satisfies Person;
  })