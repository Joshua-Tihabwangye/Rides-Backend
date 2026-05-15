import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { KafkaTopic, KafkaTopics, KafkaMessageEnvelope, TopicConfigs } from './kafka.topics';

export type MessageHandler<T = unknown> = (payload: T, envelope: KafkaMessageEnvelope<T>) => Promise<void> | void;

interface Subscription {
  topic: KafkaTopic;
  handler: MessageHandler;
  filter?: (eventType: string) => boolean;
}

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private readonly kafka: Kafka;
  private consumer: Consumer;
  private readonly enabled: boolean;
  private running = false;
  private readonly subscriptions = new Map<string, Subscription>();
  private consumerGroup: string;

  constructor() {
    this.enabled = (process.env.KAFKA_DISABLED || '').trim().toLowerCase() !== 'true';
    const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
    this.consumerGroup = process.env.KAFKA_CONSUMER_GROUP || 'evzone-backend-consumers';

    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'evzone-backend-consumer',
      brokers,
      retry: {
        initialRetryTime: 300,
        retries: 5,
      },
    });

    this.consumer = this.kafka.consumer({
      groupId: this.consumerGroup,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });
  }

  async onModuleInit() {
    if (!this.enabled) {
      this.logger.warn('Kafka consumer disabled by KAFKA_DISABLED=true');
      return;
    }

    try {
      await this.consumer.connect();
      this.logger.log(`Kafka consumer connected (group: ${this.consumerGroup})`);
    } catch (err) {
      this.logger.warn('Kafka consumer connection failed', err);
    }
  }

  async onModuleDestroy() {
    if (this.running) {
      await this.consumer.stop();
    }
    if (this.enabled) {
      await this.consumer.disconnect();
      this.logger.log('Kafka consumer disconnected');
    }
  }

  /**
   * Subscribe to a topic with a message handler.
   * Optionally filter by event type.
   */
  async subscribe<T = unknown>(
    topic: KafkaTopic,
    handler: MessageHandler<T>,
    options?: { filter?: (eventType: string) => boolean; fromBeginning?: boolean },
  ): Promise<void> {
    const subscriptionId = `${topic}-${Math.random().toString(36).slice(2, 8)}`;
    this.subscriptions.set(subscriptionId, { topic, handler: handler as MessageHandler, filter: options?.filter });

    if (!this.enabled) {
      this.logger.warn(`Kafka consumer disabled — subscription to ${topic} will not receive messages`);
      return;
    }

    try {
      await this.consumer.subscribe({ topic, fromBeginning: options?.fromBeginning || false });

      if (!this.running) {
        this.running = true;
        await this.consumer.run({
          eachMessage: async (payload: EachMessagePayload) => {
            await this.handleMessage(payload);
          },
        });
      }

      this.logger.log(`Subscribed to ${topic}`);
    } catch (err) {
      this.logger.error(`Failed to subscribe to ${topic}`, err);
    }
  }

  /**
   * Pause consumption for a topic.
   */
  async pause(topics: KafkaTopic[]): Promise<void> {
    if (!this.enabled) return;
    try {
      this.consumer.pause(topics.map((t) => ({ topic: t })));
      this.logger.log(`Paused consumption for: ${topics.join(', ')}`);
    } catch (err) {
      this.logger.error('Failed to pause consumer', err);
    }
  }

  /**
   * Resume consumption for a topic.
   */
  async resume(topics: KafkaTopic[]): Promise<void> {
    if (!this.enabled) return;
    try {
      this.consumer.resume(topics.map((t) => ({ topic: t })));
      this.logger.log(`Resumed consumption for: ${topics.join(', ')}`);
    } catch (err) {
      this.logger.error('Failed to resume consumer', err);
    }
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    const value = message.value?.toString();

    if (!value) {
      this.logger.warn(`Empty message on ${topic}:${partition}`);
      return;
    }

    let envelope: KafkaMessageEnvelope;
    try {
      envelope = JSON.parse(value) as KafkaMessageEnvelope;
    } catch {
      this.logger.warn(`Invalid JSON on ${topic}:${partition} — skipping`);
      return;
    }

    const eventType = envelope.eventType || (message.headers?.['event-type'] as string) || 'unknown';

    for (const sub of this.subscriptions.values()) {
      if (sub.topic !== topic) continue;
      if (sub.filter && !sub.filter(eventType)) continue;

      try {
        await sub.handler(envelope.payload, envelope);
      } catch (err) {
        this.logger.error(`Handler error for ${eventType} on ${topic}`, err);
      }
    }
  }
}
