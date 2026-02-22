export const formatValue = (
  label: string,
  value: number,
  currency?: string
) => {
  const monetaryLabels = [
    "Commission",
    "Total Commission",
    "Unpaid Commission",
    "Paid Commission",
    "Total Amount",
  ]

  // Add percentage labels check
  const percentageLabels = ["Click to Signup", "Signup to Paid"]

  if (monetaryLabels.includes(label) && currency) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value)
  }

  // Handle Percentage Formatting
  if (percentageLabels.includes(label)) {
    return `${value.toLocaleString()}%`
  }

  return value.toLocaleString()
}
