import amqp from "amqplib";
import { rabbitmqConfig } from "../../config/rabbitmq";

interface UserCreatedEvent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userRole: string;
}

export class RabbitMQService {
  private connection: any = null;
  private channel: any = null;
  private initialized = false;

  async initialize() {
    try {
      // Connect to RabbitMQ
      this.connection = await amqp.connect(rabbitmqConfig.url);
      this.channel = await this.connection.createChannel();

      // Setup exchange
      await this.channel.assertExchange(
        rabbitmqConfig.exchanges.user,
        "direct",
        { durable: true }
      );

      // Setup queue
      const { queue } = await this.channel.assertQueue(
        rabbitmqConfig.queues.userCreated,
        { durable: true }
      );

      // Bind queue to exchange
      await this.channel.bindQueue(
        queue,
        rabbitmqConfig.exchanges.user,
        rabbitmqConfig.routingKeys.userCreated
      );

      console.log("✅ User service connected to RabbitMQ");
      this.initialized = true;

      return queue;
    } catch (error) {
      console.error("❌ RabbitMQ connection error:", error);
      throw error;
    }
  }

  async startConsuming(
    handleMessage: (data: UserCreatedEvent) => Promise<void>
  ) {
    if (!this.initialized) {
      const queue = await this.initialize();

      // Start consuming messages
      this.channel.consume(queue, async (msg: amqp.ConsumeMessage | null) => {
        if (msg) {
          try {
            const data = JSON.parse(msg.content.toString()) as UserCreatedEvent;
            await handleMessage(data);
            // Acknowledge the message
            this.channel.ack(msg);
          } catch (error) {
            console.error("❌ Error processing message:", error);
            // Reject the message and requeue it
            this.channel.nack(msg, false, true);
          }
        }
      });

      console.log("✅ Started consuming messages from queue:", queue);
    }
  }

  async closeConnection() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.initialized = false;
      console.log("✅ RabbitMQ connection closed");
    } catch (error) {
      console.error("❌ Error closing RabbitMQ connection:", error);
    }
  }
}

export const rabbitMQService = new RabbitMQService();
