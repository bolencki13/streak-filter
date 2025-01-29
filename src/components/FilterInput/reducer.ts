import { FilterClauseDef } from "./types"

export namespace FilterInputReducer {
  export type Value = {
    clauses: FilterClauseDef[];
    editId: string | null;
  }

  export type Action = ReturnType<typeof addClause> | ReturnType<typeof updateClause> | ReturnType<typeof deleteClause> | ReturnType<typeof setEditableClause>;
}

export const DEFAULT_STATE: FilterInputReducer.Value = {
  clauses: [],
  editId: null,
}

export function handleAction(state: FilterInputReducer.Value, action: FilterInputReducer.Action) {
  switch (action.type) {
    case 'add-clause': {
      const nextState = structuredClone(state);
      nextState.clauses.push({
        id: window.crypto.randomUUID(),
        ...action.payload,
      })
      return nextState
    }
    case 'update-clause': {
      const nextState = structuredClone(state);
      nextState.clauses = nextState.clauses.map((clause) => {
        if (clause.id === action.payload.id) {
          return action.payload
        }
        return clause
      })
      return nextState
    }
    case 'delete-clause': {
      const nextState = structuredClone(state);
      nextState.clauses = nextState.clauses.filter((clause) => {
        return clause.id !== action.payload.id
      })
      return nextState
    }
    default:
      return state
  }
}

export function addClause(clause: Omit<FilterClauseDef, 'id'>) {
  return {
    type: "add-clause",
    payload: clause,
  } as const;
}
export function updateClause(clause: FilterClauseDef) {
  return {
    type: "update-clause",
    payload: clause,
  } as const;
}
export function deleteClause(clause: FilterClauseDef) {
  return {
    type: "delete-clause",
    payload: clause,
  } as const;
}
export function setEditableClause(clause: FilterClauseDef | null) {
  return {
    type: "set-editable-clause",
    payload: clause,
  } as const;
}