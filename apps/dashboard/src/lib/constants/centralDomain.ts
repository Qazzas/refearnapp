export const CENTRAL_API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://origin.refearnapp.com"
