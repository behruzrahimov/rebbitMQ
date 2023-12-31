import { FastifyReply, FastifyRequest } from "fastify";
import amqp from "amqplib";
const rabbitmqHost = "localhost";
const rabbitmqQueue = "tasks";

export async function m1(request: FastifyRequest, response: FastifyReply) {
  let connection;
  try {
    const data = request.body; // Получите данные из HTTP запроса

    // Установите соединение с RabbitMQ
    connection = await amqp.connect(`amqp://${rabbitmqHost}`);
    const channel = await connection.createChannel();

    // Опубликуйте задание в RabbitMQ
    await channel.assertQueue(rabbitmqQueue, { durable: false });
    channel.sendToQueue(rabbitmqQueue, Buffer.from(JSON.stringify(data)));

    console.log(" [x] Sent '%s'", data);
    await channel.close();
    response.status(200).send({ message: "Задание успешно отправлено" });
  } catch (error) {
    console.error("Ошибка при отправке задания:", error);
    response
      .status(500)
      .send({ error: "Возникла ошибка при отправке задания" });
  } finally {
    if (connection) await connection.close();
  }
}
