/** @jsxImportSource react */
import React, { useState } from 'react';
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
            description="Set to true if you are running a self-hosted instance."
            example="true"
          />
          <EnvItem
            id="base-url"
            name="NEXT_PUBLIC_BASE_URL"
            description="The main URL of your worker. This is where API requests and backend logic are processed."
            example="https://worker.voteflow.xyz"
          />
          <EnvItem
            id="redir"
            name="NEXT_PUBLIC_REDIRECTION_URL"
            description="The origin URL of your VPS. This is the direct address where your application is running."
            example="https://vps-origin.voteflow.xyz"
          />
          <EnvItem
            id="domain"
            name="NEXT_PUBLIC_APP_DOMAIN"
            description="REQUIRED: Use your main root domain only (e.g., domain.com). This acts as the parent domain. When users assign a subdomain in the 'Manage Domains' section, the app uses this value to correctly construct and verify those new addresses."
            example="voteflow.xyz"
          />
          <EnvItem
            id="sub"
            name="NEXT_PUBLIC_RESERVED_SUBDOMAINS"
            description="CRITICAL: List of restricted subdomains. If a user attempts to use one of these for an affiliate portal URL, the system will block the assignment to prevent overwriting managed application paths and triggering errors."
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
        <div className="space-y-10">
          {/* 1. Redis Configuration */}
          <EnvGroup title="1. Upstash Redis (Serverless)" icon="💾">
            <EnvItem
              id="redis-url"
              name="UPSTASH_REDIS_REST_URL"
              description="The REST URL for your Redis database. Used for caching and session management."
              link="https://console.upstash.com/redis"
              example="https://your-db-name.upstash.io"
            >
              <div className="mt-2 text-xs text-slate-500">
                <strong>Location:</strong> Go to the <strong>Redis</strong> tab,
                select your database, and scroll down to the{' '}
                <strong>REST API</strong> section.
              </div>
              <Frame
                src="/Upstash/UPSTASH_REDIS_REST_URL.png"
                caption="Copy the REST URL from your Redis database dashboard."
              />
            </EnvItem>

            <EnvItem
              id="redis-token"
              name="UPSTASH_REDIS_REST_TOKEN"
              description="The authentication token for your Redis REST API."
            >
              <Frame
                src="/Upstash/UPSTASH_REDIS_REST_TOKEN.png"
                caption="Copy the REST Token (ensure you don't copy the Read-Only one)."
              />
            </EnvItem>
          </EnvGroup>

          {/* 2. QStash Configuration */}
          <EnvGroup title="2. QStash (Workflow & Queues)" icon="⚡">
            <WarningBox>
              <p className="font-bold">Token Selection Guide</p>
              <p className="mt-1 opacity-90">
                Only copy the <strong>Request Token</strong>. Do <u>NOT</u> use
                the "Current Signing Key" or "Next Signing Key". RefearnApp uses
                an internal secret for signature verification, so these signing
                keys are not required.
              </p>
            </WarningBox>

            <EnvItem
              id="qstash-url"
              name="QSTASH_URL"
              description="The publishing endpoint for QStash background messaging."
              link="https://console.upstash.com/qstash"
              example="https://qstash.upstash.io/v1/publish"
            >
              <div className="mt-2 text-xs text-slate-500">
                <p>
                  <strong>Location:</strong> Go to the <strong>QStash</strong>{' '}
                  (or Workflow) tab in the top navigation.
                </p>
              </div>
              <Frame
                src="/Upstash/QSTASH_URL.png"
                caption="Verify the publishing URL in your QStash dashboard."
              />
            </EnvItem>

            <EnvItem
              id="qstash-token"
              name="QSTASH_TOKEN"
              description="Your secret QStash Bearer token (Request Token) required to authorize background tasks."
            >
              <Frame
                src="/Upstash/QSTASH_TOKEN.png"
                caption="Copy ONLY the Request Token found in the QStash dashboard."
              />
            </EnvItem>
          </EnvGroup>
        </div>
      ),
    },
    {
      id: 'email',
      label: 'Email',
      icon: '📧',
      content: <EmailTabContent />,
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
        <div className="space-y-10">
          {/* 1. Bucket Setup */}
          <EnvGroup title="1. Bucket & Public Access" icon="📦">
            <EnvItem
              id="r2-bucket"
              name="R2_BUCKET_NAME"
              description="The name you gave your bucket during creation."
              link="https://dash.cloudflare.com/?to=/:account/r2/overview"
              example="refearnapp-assets"
            >
              <div className="mt-2 text-xs text-slate-500">
                <strong>Setup:</strong> Go to R2 {`>`} Overview {`>`} Create
                Bucket. Any unique name works.
              </div>
              <Frame
                src="/R2/R2_BUCKET_NAME.png"
                caption="Create your bucket and copy the name here."
              />
            </EnvItem>

            <EnvItem
              id="r2-url"
              name="R2_ACCESS_URL"
              description="The public URL where your assets are served."
              example="https://assets.yourdomain.com"
            >
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>
                  <strong>Pro Tip:</strong> Use a Custom Domain.
                </p>
                <p className="text-xs">
                  While R2 provides a public URL, it has rate limits. Go to{' '}
                  <strong>Settings {`>`} Public Access</strong> in your bucket,
                  click <strong>Connect Domain</strong>, and Cloudflare will
                  automatically configure the DNS for you.
                </p>
              </div>
              <Frame
                src="/R2/R2_ACCESS_URL.png"
                caption="Connect a custom subdomain (e.g., assets.domain.com) for faster delivery."
              />
            </EnvItem>
          </EnvGroup>

          {/* 2. API Connection */}
          <EnvGroup title="2. S3 API Credentials" icon="🔑">
            <WarningBox>
              <p className="font-bold">Generating API Credentials</p>
              <p className="mt-1 opacity-90">
                Go to <strong>R2 Overview</strong> and click{' '}
                <strong>Manage R2 API Tokens</strong>. Create a token with{' '}
                <strong>Edit</strong> permissions for your specific bucket.
              </p>
            </WarningBox>

            <EnvItem
              id="r2-endpoint"
              name="R2_ENDPOINT"
              description="The S3 API endpoint unique to your account."
              example="https://account-id.r2.cloudflarestorage.com"
            >
              <p className="mt-2 text-xs text-slate-500">
                Found in: Bucket {`>`} Settings {`>`} S3 API Endpoint.
              </p>
              <Frame
                src="/R2/R2_ENDPOINT.png"
                caption="Copy the full S3 API URL from your bucket settings."
              />
            </EnvItem>

            {/* Separated Global Keys */}
            <EnvItem
              id="r2-id"
              name="R2_ACCESS_KEY_ID"
              description="The Access Key ID generated from your API Token."
            >
              <Frame
                src="/R2/R2_ACCESS_KEY_ID.png"
                caption="Copy the Access Key ID from the token success screen."
              />
            </EnvItem>

            <EnvItem
              id="r2-secret"
              name="R2_SECRET_ACCESS_KEY"
              description="The Secret Access Key. Note: This is only shown once!"
            >
              <Frame
                src="/R2/R2_SECRET_ACCESS_KEY.png"
                caption="Copy the Secret Access Key. Keep this extremely private."
              />
            </EnvItem>

            <EnvItem
              id="r2-token"
              name="R2_TOKEN_VALUE"
              description="The full API Token value for worker-level authentication."
            >
              <Frame
                src="/R2/R2_TOKEN_VALUE.png"
                caption="Copy the Token Value used for Cloudflare Worker authentication."
              />
            </EnvItem>
          </EnvGroup>
        </div>
      ),
    },
    {
      id: 'auth',
      label: 'Google Auth',
      icon: '🔑',
      content: (
        <div className="space-y-10">
          <EnvGroup title="Google OAuth Setup" icon="🔑">
            <WarningBox>
              <p className="font-bold">OAuth Consent Screen Required</p>
              <p className="mt-1 opacity-90">
                Before creating credentials, you must configure your{' '}
                <strong>OAuth Consent Screen</strong> in the Google Cloud
                Console. Set the User Type to "External" and add your support
                email.
              </p>
            </WarningBox>

            {/* 1. Client ID */}
            <EnvItem
              id="g-id"
              name="GOOGLE_CLIENT_ID"
              description="The unique identifier for your Google Cloud Project."
              link="https://console.cloud.google.com/apis/credentials"
              example="12345678-abcd.apps.googleusercontent.com"
            >
              <div className="mt-4 space-y-4 text-sm text-slate-600">
                <p>
                  <strong>Required Configuration:</strong> While creating your
                  OAuth 2.0 Client ID, you must set these values:
                </p>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">
                      Authorized JavaScript Origins
                    </p>
                    <code className="block rounded bg-slate-100 p-2 text-indigo-600">
                      {`NEXT_PUBLIC_BASE_URL`}
                    </code>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">
                      Authorized Redirect URIs
                    </p>
                    <code className="block rounded bg-slate-100 p-2 text-indigo-600">
                      {`NEXT_PUBLIC_BASE_URL`}/api/auth/google/callback
                    </code>
                  </div>
                </div>
              </div>
              <Frame
                src="/Google/GOOGLE_CLIENT_ID.png"
                caption="In the Credentials tab, create an 'OAuth 2.0 Client ID' and enter your origins and redirect URIs."
              />
            </EnvItem>

            {/* 2. Client Secret */}
            <EnvItem
              id="g-sec"
              name="GOOGLE_CLIENT_SECRET"
              description="Your secret key to authenticate your application with Google."
              example="GOCSPX-..."
            >
              <Frame
                src="/Google/GOOGLE_CLIENT_SECRET.png"
                caption="Copy your Client Secret from the 'Client ID for Web Application' pop-up or settings."
              />
            </EnvItem>

            {/* 3. Redirect URI reference */}
            <EnvItem
              id="g-redir"
              name="GOOGLE_REDIRECT_URI"
              description="The exact callback URL where Google sends the user after login. This MUST match the value in your Google Console exactly."
              example="https://voteflow.xyz/api/auth/google/callback"
            >
              <Frame
                src="/Google/GOOGLE_REDIRECT_URI.png"
                caption="Ensure this matches the Redirect URI you set in the Google Cloud Console."
              />
            </EnvItem>
          </EnvGroup>
        </div>
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
function EmailTabContent() {
  const [activeProvider, setActiveProvider] = useState('zepto');

  return (
    <div className="space-y-10">
      {/* Global Email Settings */}
      <EnvGroup title="General Email Settings" icon="⚙️">
        <EnvItem
          id="email-provider"
          name="EMAIL_PROVIDER"
          description="Choose your driver: 'resend', 'smtp', or 'zeptomail' (default)."
          example={activeProvider === 'zepto' ? 'zeptomail' : activeProvider}
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
          description={
            activeProvider === 'zepto'
              ? 'Enter your ZeptoMail verified domain. Ensure DNS records (SPF/DKIM) are added to Cloudflare.'
              : activeProvider === 'resend'
                ? "Enter your Resend domain. Resend handles most DNS, but ensure it's verified in Cloudflare."
                : 'Enter your SMTP sending domain. In this example we use Mailtrap, but any provider works. Manual DNS configuration in Cloudflare is required.'
          }
          example="mail.voteflow.xyz"
          link={
            activeProvider === 'zepto'
              ? 'https://zeptomail.zoho.com/'
              : activeProvider === 'resend'
                ? 'https://resend.com/domains'
                : 'https://mailtrap.io/inboxes'
          }
        >
          {/* Swapping image based on provider */}
          <Frame
            src={`/Email/${activeProvider.toUpperCase()}_EMAIL_DOMAIN.png`}
            caption={`Setup guide for ${activeProvider === 'zepto' ? 'ZeptoMail (Zoho)' : activeProvider} domain verification.`}
          />
        </EnvItem>
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
            If <code>EMAIL_PROVIDER</code> is left empty, the system defaults to{' '}
            <strong>ZeptoMail (Zoho)</strong>. In this case, you{' '}
            <strong>must</strong> configure the ZeptoMail token below for emails
            to work.
          </p>
        </WarningBox>

        <EnvTabs
          onChange={(id) => setActiveProvider(id)}
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
                    link="https://zeptomail.zoho.com/"
                  >
                    <Frame src="/Email/ZEPTO_TOKEN.png" />
                  </EnvItem>
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
                    link="https://resend.com/api-keys"
                  >
                    <Frame src="/Email/RESEND_API_KEY.png" />
                  </EnvItem>
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
                    link="https://mailtrap.io/inboxes"
                  >
                    <Frame src="/Email/SMTP_HOST.png" />
                  </EnvItem>
                  <EnvItem
                    id="smtp-port"
                    name="SMTP_PORT"
                    description="Port (usually 587 or 465)."
                    example="587"
                  >
                    <Frame src="/Email/SMTP_PORT.png" />
                  </EnvItem>
                  <EnvItem
                    id="smtp-user"
                    name="SMTP_USER"
                    description="Username for SMTP auth."
                  >
                    <Frame src="/Email/SMTP_USER.png" />
                  </EnvItem>
                  <EnvItem
                    id="smtp-pass"
                    name="SMTP_PASSWORD"
                    description="Password for SMTP auth."
                  >
                    <Frame src="/Email/SMTP_PASSWORD.png" />
                  </EnvItem>
                </EnvGroup>
              ),
            },
          ]}
        />
      </section>
    </div>
  );
}
