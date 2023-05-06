import http from "http";
import express from "express";
import { initialize, use } from "@oas-tools/core";
import redis from 'redis';

export const redisClient = redis.createClient({socket: {host: process.env.HOST??'127.0.0.1', port: process.env.PORT ?? 6379}});

const deploy = async () => {
    const serverPort = 8080;
    const app = express();
    
    use((_, res, next) => {res.setHeader('Content-Type', 'application/json'); next();}, {}, 0);
    app.use(express.json({limit: '50mb'}));
    
    const config = {}
    
    initialize(app, config).then(() => {
        http.createServer(app).listen(serverPort, () => {
        console.log("\nApp running at http://localhost:" + serverPort);
        console.log("________________________________________________________________");
        if (!config?.middleware?.swagger?.disable) {
            console.log('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
            console.log("________________________________________________________________");
        }
        });
    });
}

const undeploy = () => {
  process.exit();
};

export default {deploy, undeploy};

