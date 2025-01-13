export type Operators<T> = {
  eq?: T
  notEq?: T
  gt?: T
  gte?: T
  lt?: T
  lte?: T
  like?: T
  notLike?: T
  between?: [T, T]
  in?: T[]
  notIn?: T[]
  isNull?: boolean
  isNotNull?: boolean
}

export type WhereConditions<T> = {
  [K in keyof T]?: Operators<T[K]>
}

export type ComplexWhereConditions<T> = WhereConditions<T> & {
  and?: WhereConditions<T>[]
  or?: WhereConditions<T>[]
}
