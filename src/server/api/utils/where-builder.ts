import {
  SQL,
  and,
  or,
  eq,
  ne,
  gt,
  gte,
  lt,
  lte,
  inArray,
  notInArray,
  like,
  notLike,
  isNull,
  isNotNull
} from 'drizzle-orm'
import type { Operators } from '../types/where.types'
import type { Table } from 'drizzle-orm'

export class WhereBuilder<T extends Table> {
  constructor(private table: T) {}

  private processCondition(
    fieldConditions: Operators<unknown>,
    field: keyof T
  ): (SQL | undefined)[] {
    const conditions: (SQL | undefined)[] = []
    const column = this.table[field] as any

    if (!column || typeof column === 'function') return conditions

    if ('eq' in fieldConditions && fieldConditions.eq !== undefined) {
      conditions.push(eq(column, fieldConditions.eq))
    }
    if ('notEq' in fieldConditions && fieldConditions.notEq !== undefined) {
      conditions.push(ne(column, fieldConditions.notEq))
    }
    if ('gt' in fieldConditions && fieldConditions.gt !== undefined) {
      conditions.push(gt(column, fieldConditions.gt))
    }
    if ('gte' in fieldConditions && fieldConditions.gte !== undefined) {
      conditions.push(gte(column, fieldConditions.gte))
    }
    if ('lt' in fieldConditions && fieldConditions.lt !== undefined) {
      conditions.push(lt(column, fieldConditions.lt))
    }
    if ('lte' in fieldConditions && fieldConditions.lte !== undefined) {
      conditions.push(lte(column, fieldConditions.lte))
    }
    if ('like' in fieldConditions && fieldConditions.like !== undefined) {
      conditions.push(like(column, fieldConditions.like as string))
    }
    if ('notLike' in fieldConditions && fieldConditions.notLike !== undefined) {
      conditions.push(notLike(column, fieldConditions.notLike as string))
    }
    if ('between' in fieldConditions && fieldConditions.between !== undefined) {
      const [start, end] = fieldConditions.between
      conditions.push(and(gte(column, start), lte(column, end)))
    }
    if ('in' in fieldConditions && fieldConditions.in !== undefined) {
      conditions.push(inArray(column, fieldConditions.in))
    }
    if ('notIn' in fieldConditions && fieldConditions.notIn !== undefined) {
      conditions.push(notInArray(column, fieldConditions.notIn))
    }
    if ('isNull' in fieldConditions && fieldConditions.isNull) {
      conditions.push(isNull(column))
    }
    if ('isNotNull' in fieldConditions && fieldConditions.isNotNull) {
      conditions.push(isNotNull(column))
    }

    return conditions
  }

  buildConditions(input: Record<string, any>): SQL | undefined {
    const conditions: (SQL | undefined)[] = []

    // Procesar condiciones directas
    Object.entries(input).forEach(([field, operators]) => {
      if (field !== 'and' && field !== 'or' && operators) {
        conditions.push(...this.processCondition(operators, field as keyof T))
      }
    })

    // Procesar AND
    if (input.and?.length) {
      const andConditions = input.and.flatMap((condition: any) => {
        const subConditions: (SQL |  undefined)[] = []
        Object.entries(condition).forEach(([field, operators]) => {
          if (operators) {
            subConditions.push(
              ...this.processCondition(operators, field as keyof T)
            )
          }
        })
        return subConditions
      })

      if (andConditions.length > 0) {
        conditions.push(and(...andConditions))
      }
    }

    // Procesar OR
    if (input.or?.length) {
      const orConditions = input.or.flatMap((condition: any) => {
        const subConditions: (SQL | undefined)[] = []
        Object.entries(condition).forEach(([field, operators]) => {
          if (operators) {
            subConditions.push(
              ...this.processCondition(operators, field as keyof T)
            )
          }
        })
        return subConditions
      })

      if (orConditions.length > 0) {
        conditions.push(or(...orConditions))
      }
    }

    return conditions.length > 0 ? and(...conditions) : undefined
  }
}
