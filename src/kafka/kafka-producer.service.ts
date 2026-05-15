import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, RecordMetadata, CompressionTypes } from 'kafkajs';
import { KafkaTopic, KafkaTopics, buildEnvelope, KafkaMessageEnvelope } from './kafka.topics';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerService.name);
  private readonly kafka: Kafka;
  private producer: Producer;
  private connected = false;
  private readonly enabled: boolean;

  constructor() {
    this.enabled = (process.env.KAFKA_DISABLED || '').trim().toLowerCase() !== 'true';
    const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');

    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'evzone-backend',
      brokers,
      retry: {
        initialRetryTime: 300,
        retries: 5,
      },
    });

    this.producer = this.kafka.producer({
      idempotent: true,
      transactionalId: process.env.KAFKA_TX_ID || 'evzone-backend-tx',
      retry: {
        initialRetryTime: 300,
        retries: 5,
      },
    });
  }

  async onModuleInit() {
    if (!this.enabled) {
      this.logger.warn('Kafka producer disabled by KAFKA_DISABLED=true');
      return;
    }
    try {
      await this.producer.connect();
      this.connected = true;
      this.logger.log(`Kafka producer connected to ${process.env.KAFKA_BROKERS || 'localhost:9092'}`);
    } catch (err) {
      this.logger.warn('Kafka producer connection failed — events will be logged locally', err);
    }
  }

  async onModuleDestroy() {
    if (this.connected) {
      await this.producer.disconnect();
      this.logger.log('Kafka producer disconnected');
    }
  }

  /**
   * Publish an event to a Kafka topic.
   * If Kafka is unavailable, logs the event locally (non-blocking).
   */
  async emit<T>(
    topic: KafkaTopic,
    eventType: string,
    payload: T,
    options?: { userId?: string; sourceIp?: string; key?: string },
  ): Promise<RecordMetadata[] | null> {
    const envelope = buildEnvelope(eventType, payload, options);

    if (!this.enabled || !this.connected) {
      this.logger.debug(`[KAFKA-FALLBACK] ${topic} | ${eventType} | ${JSON.stringify(payload).slice(0, 200)}`);
      return null;
    }

    try {
      const result = await this.producer.send({
        topic,
        messages: [
          {
            key: options?.key || envelope.metadata.traceId,
            value: JSON.stringify(envelope),
            headers: {
              'event-type': eventType,
              'trace-id': envelope.metadata.traceId,
              'service': envelope.metadata.service,
            },
          },
        ],
        compression: CompressionTypes.GZIP,
      });
      this.logger.debug(`Published ${eventType} to ${topic} (trace=${envelope.metadata.traceId})`);
      return result;
    } catch (err) {
      this.logger.warn(`Failed to publish ${eventType} to ${topic}`, err);
      return null;
    }
  }

  /**
   * Emit a batch of events to the same topic.
   */
  async emitBatch<T>(
    topic: KafkaTopic,
    events: Array<{ eventType: string; payload: T; key?: string; options?: { userId?: string; sourceIp?: string } }>,
  ): Promise<RecordMetadata[] | null> {
    if (!this.enabled || !this.connected || events.length === 0) {
      return null;
    }

    const messages = events.map((e) => {
      const envelope = buildEnvelope(e.eventType, e.payload, e.options);
      return {
        key: e.key || envelope.metadata.traceId,
        value: JSON.stringify(envelope),
        headers: {
          'event-type': e.eventType,
          'trace-id': envelope.metadata.traceId,
          'service': envelope.metadata.service,
        },
      };
    });

    try {
      const result = await this.producer.send({
        topic,
        messages,
        compression: CompressionTypes.GZIP,
      });
      this.logger.debug(`Published batch of ${events.length} events to ${topic}`);
      return result;
    } catch (err) {
      this.logger.warn(`Failed to publish batch to ${topic}`, err);
      return null;
    }
  }

  /**
   * Send a transactional message (guaranteed delivery).
   */
  async emitTransactional<T>(
    topic: KafkaTopic,
    eventType: string,
    payload: T,
    options?: { userId?: string; sourceIp?: string; key?: string },
  ): Promise<RecordMetadata[] | null> {
    if (!this.enabled || !this.connected) {
      return null;
    }

    const envelope = buildEnvelope(eventType, payload, options);
    const transaction = await this.producer.transaction();

    try {
      const result = await transaction.send({
        topic,
        messages: [
          {
            key: options?.key || envelope.metadata.traceId,
            value: JSON.stringify(envelope),
          },
        ],
      });
      await transaction.commit();
      return result;
    } catch (err) {
      await transaction.abort();
      this.logger.warn(`Transactional publish failed for ${eventType} to ${topic}`, err);
      return null;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}
