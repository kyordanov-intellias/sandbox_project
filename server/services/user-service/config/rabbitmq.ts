export const rabbitmqConfig = {
  url: 'amqp://admin:admin123@rabbitmq:5672',
  exchanges: {
    user: 'user.events'
  },
  queues: {
    userCreated: 'user.created.queue'
  },
  routingKeys: {
    userCreated: 'user.created'
  }
};