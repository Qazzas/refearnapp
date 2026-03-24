"use client"
import React from "react"
import Login from "@/components/pages/Login"
import type { Metadata } from "next"
import { buildMetadata } from "@/util/BuildMetadata"
// export const metadata: Metadata = buildMetadata({
//   title: "RefearnApp | Login Page",
//   description: "Login Page",
//   url: "https://refearnapp.com/login",
//   indexable: false,
// })
const loginPage = async () => {
  return (
    <>
      <Login affiliate={false} plan={"ULTIMATE"} />
    </>
  )
}
export default loginPage
