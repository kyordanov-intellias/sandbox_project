import amqp from "amqplib";
import { rabbitmqConfig } from "../../config/rabbitmq";

interface Skill {
  name: string;
  proficiencyLevel: string;
}

interface Contact {
  type: string;
  value: string;
  isPrimary: boolean;
}

interface UserCreatedEvent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userRole: string;
  profileImage?: string;
  coverImage?: string;
  skills: Skill[];
  contacts: Contact[];
}

export class RabbitMQService {
  private connection: any = null;
  private channel: any = null;
  private initialized = false;

  private async connectWithRetry(retries = 5, interval = 5000): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        this.connection = await amqp.connect(rabbitmqConfig.url);
        this.channel = await this.connection.createChannel();
        return;
      } catch (error) {
        console.log(`Failed to connect to RabbitMQ (attempt ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
    throw new Error('Failed to connect to RabbitMQ after multiple retries');
  }

  async initialize() {
    try {
      await this.connectWithRetry();
      await this.channel.assertExchange(
        rabbitmqConfig.exchanges.user,
        "direct",
        { durable: true }
      );

      const { queue } = await this.channel.assertQueue(
        rabbitmqConfig.queues.userCreated,
        { durable: true }
      );

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

      this.channel.consume(queue, async (msg: amqp.ConsumeMessage | null) => {
        if (msg) {
          try {
            const data = JSON.parse(msg.content.toString()) as UserCreatedEvent;
            await handleMessage(data);
            this.channel.ack(msg);
          } catch (error) {
            console.error("❌ Error processing message:", error);
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
