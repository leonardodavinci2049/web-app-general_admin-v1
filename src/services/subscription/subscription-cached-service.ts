import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { createLogger } from "@/core/logger";
import type { Subscription } from "@/database/shared/auth/auth.types";
import { CACHE_TAGS } from "@/lib/cache-config";
import SubscriptionService from "./subscription.service";

const logger = createLogger("SubscriptionCachedService");

export async function getSubscriptionByUserId(
  userId: string,
): Promise<Subscription | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.subscription(userId), CACHE_TAGS.subscriptions);

  try {
    const response = await SubscriptionService.findSubscriptionByUserId({
      userId,
    });

    if (!response.success) {
      logger.error("Error loading subscription:", response.error);
      return null;
    }

    return response.data;
  } catch (error) {
    logger.error(`Failed to fetch subscription for user ${userId}:`, error);
    return null;
  }
}

export async function getSubscriptionById(
  subscriptionId: string,
): Promise<Subscription | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.subscription(subscriptionId), CACHE_TAGS.subscriptions);

  try {
    const response = await SubscriptionService.findSubscriptionById({
      subscriptionId,
    });

    if (!response.success) {
      logger.error("Error loading subscription:", response.error);
      return null;
    }

    return response.data;
  } catch (error) {
    logger.error(
      `Failed to fetch subscription by ID ${subscriptionId}:`,
      error,
    );
    return null;
  }
}
