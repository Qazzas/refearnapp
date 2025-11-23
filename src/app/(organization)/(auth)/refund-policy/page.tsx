// components/Legal/RefundPolicy.tsx
import React from "react"

const RefundPolicy = () => {
  const currentYear = new Date().getFullYear()

  return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-foreground">
      <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>

      <p className="mb-6">Effective Date: {currentYear}-01-01</p>

      <p className="mb-6">
        At RefearnApp, we strive to provide high-quality software and services
        that meet your expectations. This Refund Policy outlines our approach to
        refunds and subscription cancellations for our SaaS platform.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        1. Subscription Refunds
      </h2>
      <p className="mb-4">
        All payments for subscriptions are processed through{" "}
        <strong>Paddle</strong>. As a subscription-based SaaS, we generally do
        not provide refunds after a payment is successfully processed. However,
        exceptions may be made at our discretion in cases where the service is
        not delivered as described or technical issues prevent access to the
        platform.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        2. How to Request a Refund
      </h2>
      <p className="mb-4">
        To request a refund, please contact our support team at{" "}
        <strong>support@refearnapp.com</strong> with the following information:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>Your account email and subscription details.</li>
        <li>The reason for your refund request.</li>
        <li>Any supporting screenshots or information about the issue.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Paddle Refunds</h2>
      <p className="mb-4">
        If a refund is approved, we will issue the refund through{" "}
        <strong>Paddle</strong> using the same payment method you used for the
        original purchase. Refund processing time may vary depending on your
        bank or payment provider, typically taking 5–10 business days.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        4. Cancellation of Subscription
      </h2>
      <p className="mb-4">
        You can cancel your subscription at any time via your account settings
        on our platform. Once cancelled, your subscription will remain active
        until the end of the current billing cycle. No further charges will be
        applied after cancellation.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        5. No Refunds for Partial Use
      </h2>
      <p className="mb-4">
        We do not provide refunds for partially used subscription periods or
        unused features. Refunds are considered only under exceptional
        circumstances as described above.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Us</h2>
      <p className="mb-4">
        If you have any questions about this Refund Policy or need assistance
        with a refund request, please contact our support team at{" "}
        <strong>support@refearnapp.com</strong>.
      </p>

      <p className="text-sm mt-12">
        &copy; {currentYear} RefearnApp. All rights reserved.
      </p>
    </div>
  )
}

export default RefundPolicy
