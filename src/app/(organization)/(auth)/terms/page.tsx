// app/terms/page.tsx

import React from "react"

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-muted-foreground mb-12">
        Last Updated: {new Date().toLocaleDateString()}
      </p>

      <section className="space-y-6 text-foreground">
        <p>
          Welcome to <strong>[Your SaaS Name]</strong> (“Company”, “we”, “our”,
          or “us”). These Terms of Service (“Terms”) govern your access to and
          use of our website, products, and services (collectively, the
          “Service”). By using the Service, you agree to be bound by these
          Terms.
        </p>
        <h2 className="text-xl font-semibold">1. Eligibility</h2>
        <p>
          You must be at least 18 years old and legally capable of forming a
          binding agreement to use the Service.
        </p>
        <h2 className="text-xl font-semibold">2. Account Registration</h2>
        <p>
          You agree to provide accurate account information, safeguard your
          login credentials, and accept responsibility for any activity under
          your account.
        </p>
        <h2 className="text-xl font-semibold">3. Use of the Service</h2>
        <p>
          You agree not to misuse the Service, attempt to reverse-engineer it,
          disrupt its functionality, or engage in any unlawful activity.
        </p>
        <h2 className="text-xl font-semibold">
          4. Subscription, Billing & Payments
        </h2>
        <p>
          Our paid services are processed by <strong>Paddle</strong>, our
          Merchant of Record. By making a purchase, you also agree to Paddle’s
          Terms and Privacy Policy.
        </p>
        <h3 className="text-lg font-medium">4.1 Payments</h3>
        <p>All payments are handled securely through Paddle.</p>
        <h3 className="text-lg font-medium">4.2 Billing</h3>
        <p>
          Subscriptions renew automatically unless canceled. If payment fails,
          your access may be limited or suspended.
        </p>
        <h3 className="text-lg font-medium">4.3 Cancellation</h3>
        <p>
          You may cancel anytime. Access remains active until the end of the
          current billing cycle.
        </p>
        <h2 className="text-xl font-semibold">5. Refunds</h2>
        <p>
          Refunds are handled through Paddle and must comply with our separate{" "}
          <strong>Refund Policy</strong>. Refund approval is determined based on
          usage and circumstances.
        </p>
        <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
        <p>
          All content, code, logos, and assets belong to the Company. You may
          not reproduce or distribute any part of the Service without written
          permission.
        </p>
        <h2 className="text-xl font-semibold">7. Third-Party Services</h2>
        <p>
          We may integrate third-party tools such as Paddle. We are not
          responsible for their content, terms, or practices.
        </p>
        <h2 className="text-xl font-semibold">8. Termination</h2>
        <p>
          We reserve the right to suspend or terminate accounts that violate
          these Terms or create technical/security risks.
        </p>
        <h2 className="text-xl font-semibold">9. Limitation of Liability</h2>
        <p>
          To the fullest extent allowed by law, the Company is not liable for
          indirect damages, data loss, downtime, or security incidents.
        </p>
        <h2 className="text-xl font-semibold">10. Changes to These Terms</h2>
        <p>
          We may modify these Terms at any time. Significant changes may be
          communicated via email or platform notice.
        </p>
        <h2 className="text-xl font-semibold">11. Contact Us</h2>
        <p>If you have questions about these Terms, contact us at </p>{" "}
        <strong>support@refearnapp.com</strong>.
      </section>
    </div>
  )
}
