export const StringOperatorEnum = Object.freeze({
  EQUAL: 'equals',
  CONTAINS: 'contains',
});
export type StringOperatorEnum =
  (typeof StringOperatorEnum)[keyof typeof StringOperatorEnum];

export const NumberOperatorEnum = Object.freeze({
  EQUAL: 'equals',
  LESS_THAN: 'is less than',
  GREATER_THAN: 'is greater than',
});
export type NumberOperatorEnum =
  (typeof NumberOperatorEnum)[keyof typeof NumberOperatorEnum];

export const BooleanOperatorEnum = Object.freeze({
  EQUAL: 'is',
  NOT_EQUAL: 'is not',
});
export type BooleanOperatorEnum =
  (typeof BooleanOperatorEnum)[keyof typeof BooleanOperatorEnum];

export const DateOperatorEnum = Object.freeze({
  EQUAL: 'is',
  LESS_THAN: 'is before',
  GREATER_THAN: 'is after',
});
export type DateOperatorEnum =
  (typeof DateOperatorEnum)[keyof typeof DateOperatorEnum];

export const MultiSelectOperatorEnum = Object.freeze({
  CONTAINS: 'has',
  DOES_NOT_CONTAIN: 'does not have'
});
export type MultiSelectOperatorEnum =
  (typeof MultiSelectOperatorEnum)[keyof typeof MultiSelectOperatorEnum];

