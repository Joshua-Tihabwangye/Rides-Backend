/**
 * Kafka Topics for EVzone Event Streaming
 * All topics use a single partition with replication factor 1 for dev.
 * Production should increase partitions and replication.
 */

export const KafkaTopics = {
  /* ─── Domain Events ─── */
  TRIPS: 'evzone.trips',
  DELIVERIES: 'evzone.deliveries',
  RIDER_SERVICES: 'evzone.rider-services',
  PAYMENTS: 'evzone.payments',
  EARNINGS: 'evzone.earnings',

  /* ─── Realtime / Notifications ─── */
  NOTIFICATIONS: 'evzone.notifications',
  DRIVER_LOCATION: 'evzone.driver-location',

  /* ─── Analytics / Audit ─── */
  ANALYTICS: 'evzone.analytics',
  AUDIT_LOGS: 'evzone.audit-logs',

  /* ─── System / Lifecycle ─── */
  SYSTEM_ALERTS: 'evzone.system-alerts',
  USER_ACTIVITY: 'evzone.user-activity',
} as const;

export type KafkaTopic = (typeof KafkaTopics)[keyof typeof KafkaTopics];

/**
 * Topic configuration for auto-creation
 */
export const TopicConfigs: Record<KafkaTopic, { partitions: number; replicationFactor: number }> = {
  [KafkaTopics.TRIPS]: { partitions: 3, replicationFactor: 1 },
  [KafkaTopics.DELIVERIES]: { partitions: 3, replicationFactor: 1 },
  [KafkaTopics.RIDER_SERVICES]: { partitions: 2, replicationFactor: 1 },
  [KafkaTopics.PAYMENTS]: { partitions: 2, replicationFactor: 1 },
  [KafkaTopics.EARNINGS]: { partitions: 2, replicationFactor: 1 },
  [KafkaTopics.NOTIFICATIONS]: { partitions: 3, replicationFactor: 1 },
  [KafkaTopics.DRIVER_LOCATION]: { partitions: 6, replicationFactor: 1 },
  [KafkaTopics.ANALYTICS]: { partitions: 2, replicationFactor: 1 },
  [KafkaTopics.AUDIT_LOGS]: { partitions: 2, replicationFactor: 1 },
  [KafkaTopics.SYSTEM_ALERTS]: { partitions: 1, replicationFactor: 1 },
  [KafkaTopics.USER_ACTIVITY]: { partitions: 3, replicationFactor: 1 },
};

/**
 * Standard message envelope for all Kafka events
 */
export interface KafkaMessageEnvelope<T = unknown> {
  eventType: string;
  payload: T;
  metadata: {
    traceId: string;
    timestamp: number;
    service: string;
    version: string;
    sourceIp?: string;
    userId?: string;
  };
}

/**
 * Generate a trace ID for event correlation
 */
export function generateTraceId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Build a standard message envelope
 */
export function buildEnvelope<T>(
  eventType: string,
  payload: T,
  options?: { userId?: string; sourceIp?: string },
): KafkaMessageEnvelope<T> {
  return {
    eventType,
    payload,
    metadata: {
      traceId: generateTraceId(),
      timestamp: Date.now(),
      service: 'evzone-backend',
      version: '1.0.0',
      ...options,
    },
  };
}
