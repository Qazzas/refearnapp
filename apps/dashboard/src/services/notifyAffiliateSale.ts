import { db } from "@/db/drizzle";
import { user, affiliate, organization } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/sendEmail";

interface NotifyAffiliateSaleInput {
  orgId: string;
  affiliateId: string;
  saleAmount: string;
  commissionAmount: string;
  currency?: string;
}

/**
 * Notifies both the Organization Owner and the Affiliate about a successful referral sale.
 */
export async function notifyAffiliateSale({
  orgId,
  affiliateId,
  saleAmount,
  commissionAmount,
  currency = "USD",
}: NotifyAffiliateSaleInput) {
  try {
    // 1. Fetch Organization and the Owner's email
    const orgWithUser = await db
      .select({
        orgName: organization.name,
        ownerEmail: user.email,
        ownerName: user.name,
      })
      .from(organization)
      .innerJoin(user, eq(organization.userId, user.id))
      .where(eq(organization.id, orgId))
      .then((res) => res[0]);

    // 2. Fetch Affiliate details
    const affiliateRecord = await db.query.affiliate.findFirst({
      where: (t, { eq }) => eq(t.id, affiliateId),
    });

    if (!orgWithUser || !affiliateRecord) return;

    const formattedSale = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(Number(saleAmount));
    
    const formattedComm = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(Number(commissionAmount));

    // 3. Notify Organization Owner
    await sendEmail({
      to: orgWithUser.ownerEmail,
      subject: `New Referral Sale: ${formattedComm} Commission Earned!`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <h2>Congratulations!</h2>
          <p>Your affiliate <strong>${affiliateRecord.name}</strong> just referred a new sale for ${orgWithUser.orgName}.</p>
          <p><strong>Sale Amount:</strong> ${formattedSale}<br />
          <strong>Commission Due:</strong> ${formattedComm}</p>
          <p>You can view more details in your <a href="${process.env.NEXT_PUBLIC_BASE_URL}/organization/${orgId}/dashboard">dashboard</a>.</p>
        </div>
      `,
    });

    // 4. Notify Affiliate
    await sendEmail({
      to: affiliateRecord.email,
      subject: `You've earned a commission from ${orgWithUser.orgName}!`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <h2>Great job!</h2>
          <p>You've earned a <strong>${formattedComm}</strong> commission from a referral sale for ${orgWithUser.orgName}.</p>
          <p>Keep up the great work! You can track your earnings in your <a href="${process.env.NEXT_PUBLIC_BASE_URL}/affiliate/${orgId}/dashboard">affiliate dashboard</a>.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending affiliate sale notifications:", error);
  }
}