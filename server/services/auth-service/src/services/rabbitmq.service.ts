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
      this.connection = await amqp.connect(rabbitmqConfig.url);
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange(
        rabbitmqConfig.exchanges.user,
        "direct",
        { durable: true }
      );

      console.log("✅ Auth service connected to RabbitMQ");
      this.initialized = true;
    } catch (error) {
      console.error("❌ RabbitMQ connection error:", error);
      throw error;
    }
  }

  async publishUserCreated(userData: UserCreatedEvent) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const success = this.channel.publish(
        rabbitmqConfig.exchanges.user,
        rabbitmqConfig.routingKeys.userCreated,
        Buffer.from(JSON.stringify(userData)),
        {
          persistent: true,
          contentType: "application/json",
        }
      );

      if (success) {
        console.log(
          `✅ Published user.created event for userId: ${userData.id}`
        );
      }
    } catch (error) {
      console.error("❌ Error publishing user.created event:", error);
      throw error;
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
