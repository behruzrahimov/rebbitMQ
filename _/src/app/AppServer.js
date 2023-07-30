import { AppConfig } from "./AppConfig.js";
import { fastify } from "fastify";
import fastifyCors from "@fastify/cors";
import { m1 } from "../m1.js";
const server = fastify();
server.register(fastifyCors, {
    origin: true,
});
server.post("/process", m1);
server.listen({ host: "0.0.0.0", port: parseInt(AppConfig.port) }, async () => {
    try {
        console.log(`Server started at ${AppConfig.domain}`);
    }
    catch (e) {
        console.error(e);
    }
});
//# sourceMappingURL=AppServer.js.map