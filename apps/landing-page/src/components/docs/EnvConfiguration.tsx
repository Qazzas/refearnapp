/** @jsxImportSource react */
import React from 'react';
import EnvTabs from './EnvTabs';
import { EnvGroup, EnvItem } from './EnvGroup';
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
        <EnvGroup title="Payment Gateway (Stripe)" icon="💳">
          <EnvItem
            id="s-id"
            name="STRIPE_CLIENT_ID"
            description="Stripe Connect Client ID for platform features."
          />
          <EnvItem
            id="s-key"
            name="STRIPE_SECRET_KEY"
            description="Your Stripe Secret Key (sk_test_... or sk_live_...)."
          />
          <EnvItem
            id="s-wh"
            name="STRIPE_WEBHOOK_SECRET"
            description="Webhook signing secret to verify Stripe events."
            example="whsec_..."
          />
        </EnvGroup>
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
            description="API Key for real-time currency conversion rates."
            example="cur_live_..."
          />
        </EnvGroup>
      ),
    },
  ];

  return <EnvTabs tabs={tabs} />;
}
