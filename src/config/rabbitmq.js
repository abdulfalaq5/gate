const amqp = require('amqplib');
const { lang } = require('../lang');

// RabbitMQ Configuration
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:9505';
const RABBITMQ_PORT = process.env.RABBITMQ_PORT || '9505';
const RABBITMQ_PORT_MANAGEMENT = process.env.RABBITMQ_PORT_MANAGEMENT || '9506';
const RABBITMQ_DEFAULT_USER = process.env.RABBITMQ_DEFAULT_USER || 'guest';
const RABBITMQ_DEFAULT_PASS = process.env.RABBITMQ_DEFAULT_PASS || 'guest';

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    return { connection, channel };
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    throw error;
  }
};

const publishToRabbitMqQueueSingle = async (exchangeName, queueName, data) => {
  const config = await connectRabbitMQ()

  try {
    if (config?.connection && config?.channel) {
      await config?.channel.assertExchange(exchangeName, 'fanout', { durable: true })
      await config?.channel.assertQueue(queueName, { durable: true })
      await config?.channel.bindQueue(queueName, exchangeName)

      config?.channel.publish(exchangeName, '', Buffer.from(JSON.stringify(data)))
      console.info(lang.__('rabbitmq.publish'))
    } else {
      console.info(`failed to publish ${exchangeName} - ${queueName}`, config?.error)
    }
  } catch (e) {
    console.error(lang.__('rabbitmq.error'), e)
  } finally {
    console.info(lang.__('rabbitmq.closing'))
    await config?.channel.close()
    await config?.connection.close()
    console.info(lang.__('rabbitmq.closed'))
  }
}

// Get RabbitMQ configuration info
const getRabbitMQConfig = () => {
  return {
    url: RABBITMQ_URL,
    port: RABBITMQ_PORT,
    managementPort: RABBITMQ_PORT_MANAGEMENT,
    defaultUser: RABBITMQ_DEFAULT_USER,
    defaultPass: RABBITMQ_DEFAULT_PASS,
    managementUrl: `http://${RABBITMQ_DEFAULT_USER}:${RABBITMQ_DEFAULT_PASS}@localhost:${RABBITMQ_PORT_MANAGEMENT}`
  };
};

module.exports = {
  connectRabbitMQ,
  publishToRabbitMqQueueSingle,
  getRabbitMQConfig,
  RABBITMQ_URL,
  RABBITMQ_PORT,
  RABBITMQ_PORT_MANAGEMENT,
  RABBITMQ_DEFAULT_USER,
  RABBITMQ_DEFAULT_PASS
}
