"use client"

import React from "react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

const FAQ = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-muted-foreground mt-4">
          Answers to the most common questions about RefearnApp.
        </p>
      </div>

      <div className="max-w-3xl mx-auto animate-fade-in">
        <Accordion type="single" collapsible className="space-y-4">
          {/* FREE TRIAL */}
          <AccordionItem value="item-1">
            <AccordionTrigger>Can I try RefearnApp for free?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes! You can try RefearnApp completely free for 7 days. During
              your trial, you’ll have full access to all features—no credit card
              required. This allows you to explore the dashboard, set up your
              affiliate program, and understand how RefearnApp can help grow
              your SaaS.
            </AccordionContent>
          </AccordionItem>

          {/* SUPPORTED PLATFORMS */}
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Which platforms does RefearnApp support?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              RefearnApp currently supports Stripe and Paddle for subscription
              tracking and payment reporting. We’re actively working on adding
              more integrations to support a wider range of billing platforms in
              the future.
            </AccordionContent>
          </AccordionItem>

          {/* PAYING AFFILIATES — UPDATED */}
          <AccordionItem value="item-3">
            <AccordionTrigger>How do I pay my affiliates?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              At the moment, you can export a complete CSV payout file directly
              from your dashboard. This CSV contains all affiliate earnings for
              the selected period and can be used to send payments quickly and
              easily through PayPal. We plan to introduce additional payout
              options and automated payment flows in future updates to make the
              process even more seamless.
            </AccordionContent>
          </AccordionItem>

          {/* COMMISSION DURATION */}
          <AccordionItem value="item-4">
            <AccordionTrigger>
              Can I set how long affiliates get paid?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Absolutely. RefearnApp allows you to define how long an affiliate
              should continue receiving commissions. You can configure both the
              duration value and the time unit—days, weeks, or months—giving you
              complete flexibility over your commission structure.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}

export default FAQ
