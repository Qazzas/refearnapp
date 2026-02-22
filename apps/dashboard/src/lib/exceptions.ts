// lib/exceptions.ts
export class AppError extends Error {
  public status: number
  public toast: string
  public error: string
  public fields?: Record<string, string> | null
  public data?: any
  public ok: false = false

  constructor(options: {
    status?: number
    error?: string
    toast?: string
    fields?: Record<string, string> | null
    data?: any
    ok?: boolean
  }) {
    // 1. Determine the message for the base Error class
    const message =
      options.error || options.toast || "An unexpected error occurred"
    super(message)

    this.name = "AppError"
    this.status = options.status || 500

    // 2. Ensure these are always strings
    this.error = options.error || message
    this.toast = options.toast || this.error

    this.fields = options.fields || null
    this.data = options.data

    // Recommended for custom errors in TS
    Object.setPrototypeOf(this, AppError.prototype)
  }
}
