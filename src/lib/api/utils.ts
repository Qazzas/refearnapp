export function withQuery(url: string, params: Record<string, any>) {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    // ✅ Automatically stringify objects/arrays
    if (typeof value === "object") {
      query.append(key, JSON.stringify(value))
    } else {
      query.append(key, String(value))
    }
  })

  const queryString = query.toString()
  return queryString ? `${url}?${queryString}` : url
}
