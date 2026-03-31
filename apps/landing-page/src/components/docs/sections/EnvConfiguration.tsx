/** @jsxImportSource react */
import React from 'react';
import EnvTabs from '../EnvTabs.tsx';
import { EnvGroup, EnvItem } from '../EnvGroup.tsx';
import Frame from '../Frame.tsx';
const WarningBox = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
    <span className="text-lg">⚠️</span>
    <div>{children}</div>
  </div>
);
export default function EnvConfiguration() {
  const tabs = [
    {
      id: 'db',
      label: 'Database',
      icon: '🗄️',
      content: (
        <EnvGroup title="Database Configuration" icon="🗄️">
          <EnvItem
            id="database-url"
            name="DATABASE_URL"
            description="PostgreSQL connection string for Drizzle ORM."
            example="postgresql://user:password@localhost:5432/RefearnApp"
          />
        </EnvGroup>
      ),
    },
    {
      id: 'domains',
      label: 'Domains',
      icon: '🌐',
      content: (
        <EnvGroup title="Domain & Public Constants" icon="🌐">
          <EnvItem
            id="self-hosted"
            name="NEXT_PUBLIC_SELF_HOSTED"
            description="Set true for self-hosted."
            example="true"
          />
          <EnvItem
            id="base-url"
            name="NEXT_PUBLIC_BASE_URL"
            description="Your worker base url"
            example="https://voteflow.xyz"
          />
          <EnvItem
            id="redir"
            name="NEXT_PUBLIC_REDIRECTION_URL"
            description="Base origin URL."
            example="https://origin.voteflow.xyz"
          />
          <EnvItem
            id="domain"
            name="NEXT_PUBLIC_APP_DOMAIN"
            description="Primary root domain."
            example="voteflow.xyz"
          />
          <EnvItem
            id="sub"
            name="NEXT_PUBLIC_RESERVED_SUBDOMAINS"
            description="Restricted subdomains."
            codeSnippet="assets,asset,cdn,api,affiliate,dashboard,app,www"
          />
        </EnvGroup>
      ),
    },
    {
      id: 'upstash',
      label: 'Upstash',
      icon: '🚀',
      content: (
        <EnvGroup title="Redis & Queue Management" icon="🚀">
          <EnvItem
            id="redis-url"
            name="UPSTASH_REDIS_REST_URL"
            description="The REST URL for your Upstash Redis database."
            example="https://your-db-name.upstash.io"
          />
          <EnvItem
            id="redis-token"
            name="UPSTASH_REDIS_REST_TOKEN"
            description="REST API token for Upstash Redis authentication."
          />
          <EnvItem
            id="qstash-url"
            name="QSTASH_URL"
            description="Endpoint for QStash background messaging."
            example="https://qstash.upstash.io/v1/publish"
          />
          <EnvItem
            id="qstash-token"
            name="QSTASH_TOKEN"
            description="Your secret QStash Bearer token."
          />
        </EnvGroup>
      ),
    },
    {
      id: 'email',
      label: 'Email',
      icon: '📧',
      content: (
        <div className="space-y-10">
          {/* Global Email Settings */}
          <EnvGroup title="General Email Settings" icon="⚙️">
            <EnvItem
              id="email-provider"
              name="EMAIL_PROVIDER"
              description="Choose your driver: 'resend', 'smtp', or 'zeptomail' (default)."
              example="zeptomail"
            />
            <EnvItem
              id="email-from-name"
              name="EMAIL_FROM_NAME"
              description="The name appearing in the 'From' field."
              example="RefearnApp Support"
            />
            <EnvItem
              id="email-from-addr"
              name="EMAIL_FROM_ADDRESS"
              description="The full email address to send from."
              example="noreply@mail.voteflow.xyz"
            />
            <EnvItem
              id="email-domain"
              name="EMAIL_DOMAIN"
              description="The verified sending domain."
              example="mail.voteflow.xyz"
            />
            <EnvItem
              id="email-callback"
              name="EMAIL_VERIFICATION_CALLBACK_URL"
              description="Where users are sent after clicking the verification link."
              example="https://voteflow.xyz/email-verified"
            />
          </EnvGroup>

          {/* Provider Specific Settings - Nested Tabs */}
          <section>
            <h2 className="mb-4 text-sm font-bold tracking-widest text-slate-400 uppercase">
              Select Provider Configuration
            </h2>
            <WarningBox>
              <p className="font-bold">Default Provider Logic</p>
              <p className="mt-1 opacity-90">
                If <code>EMAIL_PROVIDER</code> is left empty, the system
                defaults to <strong>ZeptoMail (Zoho)</strong>. In this case, you{' '}
                <strong>must</strong> configure the ZeptoMail token below for
                emails to work.
              </p>
            </WarningBox>
            <EnvTabs
              tabs={[
                {
                  id: 'zepto',
                  label: 'ZeptoMail',
                  icon: '⚡',
                  content: (
                    <EnvGroup title="ZeptoMail Configuration" icon="⚡">
                      <EnvItem
                        id="zepto-token"
                        name="ZEPTO_TOKEN"
                        description="Your ZeptoMail Send Mail Token."
                      />
                    </EnvGroup>
                  ),
                },
                {
                  id: 'resend',
                  label: 'Resend',
                  icon: '✉️',
                  content: (
                    <EnvGroup title="Resend Configuration" icon="✉️">
                      <EnvItem
                        id="resend-api"
                        name="RESEND_API_KEY"
                        description="Your Resend API Key (re_...)."
                      />
                    </EnvGroup>
                  ),
                },
                {
                  id: 'smtp',
                  label: 'SMTP',
                  icon: '🛠️',
                  content: (
                    <EnvGroup title="SMTP Configuration (Manual)" icon="🛠️">
                      <EnvItem
                        id="smtp-host"
                        name="SMTP_HOST"
                        description="SMTP Server hostname."
                        example="smtp.zoho.com"
                      />
                      <EnvItem
                        id="smtp-port"
                        name="SMTP_PORT"
                        description="Port (usually 587 or 465)."
                        example="587"
                      />
                      <EnvItem
                        id="smtp-user"
                        name="SMTP_USER"
                        description="Username for SMTP auth."
                      />
                      <EnvItem
                        id="smtp-pass"
                        name="SMTP_PASSWORD"
                        description="Password for SMTP auth."
                      />
                    </EnvGroup>
                  ),
                },
              ]}
            />
          </section>
        </div>
      ),
    },
    {
      id: 'security',
      label: 'Security',
      icon: '🛡️',
      content: (
        <EnvGroup title="Internal Secrets" icon="🛡️">
          <EnvItem
            id="secret-key"
            name="SECRET_KEY"
            description="Main encryption key for sessions and cookies. Generate a random 32-char string."
            example="a_very_long_random_string_here"
          />
          <EnvItem
            id="seed-sec"
            name="SEED_SECRET"
            description="Authorization key required to run database seed scripts."
          />
          <EnvItem
            id="internal-secret"
            name="INTERNAL_SECRET"
            description="Secret used for internal API-to-API communication."
          />
          <EnvItem
            id="debug-secret"
            name="DEBUG_SECRET"
            description="Authorized secret to access debug headers or logs."
          />
        </EnvGroup>
      ),
    },
    {
      id: 'storage',
      label: 'Cloudflare R2',
      icon: '☁️',
      content: (
        <EnvGroup title="Cloudflare R2 Storage" icon="☁️">
          <EnvItem
            id="r2-id"
            name="R2_ACCESS_KEY_ID"
            description="S3 API Access Key ID from Cloudflare R2."
          />
          <EnvItem
            id="r2-secret"
            name="R2_SECRET_ACCESS_KEY"
            description="S3 API Secret Access Key."
          />
          <EnvItem
            id="r2-endpoint"
            name="R2_ENDPOINT"
            description="The S3 API endpoint for your R2 bucket."
            example="https://<account-id>.r2.cloudflarestorage.com"
          />
          <EnvItem
            id="r2-url"
            name="R2_ACCESS_URL"
            description="The public URL where your assets are served."
            example="https://assets.voteflow.xyz"
          />
          <EnvItem
            id="r2-token"
            name="R2_TOKEN_VALUE"
            description="API Token value for worker-level access."
          />
          <EnvItem
            id="r2-bucket"
            name="R2_BUCKET_NAME"
            description="The name of your R2 bucket."
            example="refearnapp-assets"
          />
        </EnvGroup>
      ),
    },
    {
      id: 'auth',
      label: 'Google Auth',
      icon: '🔑',
      content: (
        <EnvGroup title="Google Authentication" icon="🔑">
          <EnvItem
            id="g-id"
            name="GOOGLE_CLIENT_ID"
            description="OAuth Client ID."
          />
          <EnvItem
            id="g-sec"
            name="GOOGLE_CLIENT_SECRET"
            description="OAuth Client Secret."
          />
          <EnvItem
            id="g-redir"
            name="GOOGLE_REDIRECT_URI"
            description="Authorized redirect URI for Google OAuth."
            example="https://voteflow.xyz/api/auth/google/callback"
          />
        </EnvGroup>
      ),
    },
    {
      id: 'stripe',
      label: 'Stripe',
      icon: '💳',
      content: (
        <div className="space-y-10">
          {/* 1. Connect Client ID */}
          <EnvGroup title="1. Stripe Connect (Platform Setup)" icon="🔗">
            <WarningBox>
              <p className="font-bold">Important: Central Account Logic</p>
              <p className="mt-1 opacity-90">
                To manage multiple sub-accounts, you must designate one
                **Central Stripe Account**. Log into that account, go to the
                Connect tab, and click <strong>"Get Started"</strong> to enable
                platform features.
              </p>
            </WarningBox>

            <EnvItem
              id="s-id"
              name="STRIPE_CLIENT_ID"
              description="Found in Settings > Connect > Settings. Scroll to 'Integration' to find your 'Test mode client ID'."
              link="https://dashboard.stripe.com/settings/connect"
              example="ca_..."
            >
              <div className="mt-4 space-y-4 text-sm text-slate-600">
                <p>
                  <strong>Required Action:</strong> You must add your OAuth
                  Redirect URL in the same settings page under "Redirect URIs":
                </p>
                <code className="block rounded bg-slate-100 p-2 text-indigo-600">
                  {`NEXT_PUBLIC_BASE_URL`}/api/stripe/oauth/callback
                </code>
              </div>
              <Frame
                src="/Stripe/STRIPE_CLIENT_ID.png"
                caption="Enable OAuth in Connect Settings and copy your Client ID."
              />
            </EnvItem>
          </EnvGroup>

          {/* 2. API Keys */}
          <EnvGroup title="2. Standard API Keys" icon="🔑">
            <EnvItem
              id="s-key"
              name="STRIPE_SECRET_KEY"
              description="Your main Secret Key. Found on the Stripe Home/Developers dashboard."
              link="https://dashboard.stripe.com/apikeys"
              example="sk_live_..."
            >
              <Frame
                src="/Stripe/STRIPE_SECRET_KEY.png"
                caption="Copy your Secret Key from the API Keys tab in the Developers section."
              />
            </EnvItem>
          </EnvGroup>

          {/* 3. Webhooks */}
          <EnvGroup title="3. Webhook Configuration" icon="⚡">
            <EnvItem
              id="s-wh"
              name="STRIPE_WEBHOOK_SECRET"
              description="Used to verify incoming events from Stripe."
              link="https://dashboard.stripe.com/webhooks"
              example="whsec_..."
            >
              <div className="mt-4 space-y-3">
                <WarningBox>
                  <p className="font-bold">Select Correct Event Source</p>
                  <p className="mt-1 opacity-90">
                    In the "Listen to" dropdown, you <strong>must</strong>{' '}
                    select: <br />
                    <span className="font-bold">
                      "Events on connected accounts"
                    </span>{' '}
                    (not "Events on your account").
                  </p>
                </WarningBox>

                <p className="text-sm font-bold text-slate-700">
                  Endpoint URL to add:
                </p>
                <code className="block rounded bg-slate-100 p-2 text-indigo-600">
                  {`NEXT_PUBLIC_REDIRECTION_URL`}/api/webhooks/stripe
                </code>

                <p className="mt-4 text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Select All 11 Required Events:
                </p>
                <ul className="grid grid-cols-1 gap-2 text-[10px] md:grid-cols-2 lg:grid-cols-3">
                  {[
                    'charge.refunded',
                    'charge.succeeded',
                    'checkout.session.completed',
                    'coupon.deleted',
                    'customer.subscription.created',
                    'customer.subscription.updated',
                    'invoice.paid',
                    'invoice.payment_succeeded',
                    'payment_intent.succeeded',
                    'promotion_code.created',
                    'promotion_code.updated',
                  ].map((event) => (
                    <li
                      key={event}
                      className="rounded border border-slate-100 bg-slate-50 p-2 font-mono text-indigo-600"
                    >
                      {event}
                    </li>
                  ))}
                </ul>
              </div>
              <Frame
                src="/Stripe/STRIPE_WEBHOOK_SECRET.png"
                caption="Ensure 'Listen to events on connected accounts' is selected and all 11 events are checked."
              />
            </EnvItem>
          </EnvGroup>
        </div>
      ),
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: '🔌',
      content: (
        <EnvGroup title="Third-Party APIs" icon="🔌">
          <EnvItem
            id="currency-api"
            name="CURRENCY_API_KEY"
            description="Used for real-time currency conversion. RefearnApp uses CurrencyAPI to ensure your affiliate payouts are accurate across different currencies."
            link="https://app.currencyapi.com/" // Direct link to their dashboard
            example="cur_live_..."
          >
            {/* Step-by-step Image Guide */}
            <Frame
              src="/Api-keys/CURRENCY_API_KEY.png"
              caption="Log in to CurrencyAPI, go to your Dashboard, and copy the API Key shown in the 'API Key' section."
              alt="Where to find CurrencyAPI key"
            />
          </EnvItem>
        </EnvGroup>
      ),
    },
  ];

  return <EnvTabs tabs={tabs} />;
}
