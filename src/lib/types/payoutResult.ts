type TableResult<T> = {
  mode: "TABLE"
  rows: T[]
  hasNext: boolean
}

type ExportResult<T> = {
  mode: "EXPORT"
  rows: T[]
}

export type PayoutResult<T> = TableResult<T> | ExportResult<T>
