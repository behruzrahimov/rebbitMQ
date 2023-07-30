import amqp from "amqplib";
const rabbitmqHost = "localhost";
const rabbitmqQueue = "tasks";
// Обработчик заданий
async function processTask(task) {
    try {
        // Обработайте задание, выполнив необходимую логику
        const result = task; // Здесь должна быть реальная обработка задания
        // Установите соединение с RabbitMQ
        const connection = await amqp.connect(`amqp://${rabbitmqHost}`);
        const channel = await connection.createChannel();
        // Опубликуйте результат в RabbitMQ
        await channel.assertQueue(rabbitmqQueue, { durable: false });
        channel.sendToQueue(rabbitmqQueue, Buffer.from(JSON.stringify(result)));
        // Закройте соединение с RabbitMQ
        await channel.close();
        await connection.close();
    }
    catch (error) {
        console.error("Ошибка при обработке задания:", error);
    }
}
// Подключение к RabbitMQ и прослушивание заданий
async function startWorker() {
    try {
        // Установите соединение с RabbitMQ
        const connection = await amqp.connect(`amqp://${rabbitmqHost}`);
        const channel = await connection.createChannel();
        // Создайте очередь для заданий
        await channel.assertQueue(rabbitmqQueue);
        // Обработка заданий из очереди
        await channel.consume(rabbitmqQueue, async (message) => {
            if (message !== null) {
                const task = JSON.parse(message.content.toString());
                await processTask(task);
                // Подтвердите выполнение задания
                channel.ack(message);
            }
        });
    }
    catch (error) {
        console.error("Ошибка при запуске микросервиса М2:", error);
    }
}
// Запуск микросервиса М2
await startWorker();
//# sourceMappingURL=m2.js.map