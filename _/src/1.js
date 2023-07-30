import amqplib from "amqplib/callback_api.js";
const queue = "tasks";
amqplib.connect("amqp://localhost", (err, conn) => {
    if (err)
        throw err;
    // Listener
    conn.createChannel((err, ch2) => {
        if (err)
            throw err;
        ch2.assertQueue(queue);
        ch2.consume(queue, (msg) => {
            if (msg !== null) {
                console.log(msg.content.toString());
                ch2.ack(msg);
            }
            else {
                console.log("Consumer cancelled by server");
            }
        });
    });
    // Sender
    conn.createChannel((err, ch1) => {
        if (err)
            throw err;
        ch1.assertQueue(queue);
        setInterval(() => {
            ch1.sendToQueue(queue, Buffer.from("something to do"));
        }, 1000);
    });
});
//# sourceMappingURL=1.js.map