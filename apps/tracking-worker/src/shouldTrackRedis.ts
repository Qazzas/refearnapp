import { RedisLinkMetadata } from './redisLinkMetadata';

export function shouldTrackRedis(org: RedisLinkMetadata, isSelfHosted: boolean): boolean {
	if (isSelfHosted) return true;
	if (!org) return false;

	const { paymentType, expiresAt } = org;

	// 1. ONE-TIME PURCHASE (Always track)
	if (paymentType === 'ONE-TIME') return true;

	// 2. SUBSCRIPTION
	if (paymentType === 'SUBSCRIPTION') {
		// If expiresAt is null (real null), the subscription is active
		if (expiresAt === null || expiresAt === 'null') return true;

		const expiryDate = new Date(expiresAt);
		// Track only if the current time is before the expiry date
		return expiryDate > new Date();
	}

	return false;
}
